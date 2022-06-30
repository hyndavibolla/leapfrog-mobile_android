//
//  AppleWallet.swift
//  ShopYourWayMAX
//
//  Created by Sergio Daniel on 14/11/21.
//

import Foundation
import PassKit
import os.log

protocol WalletOperationDelegate: AnyObject {
  
  func operationHasBeenCompleted(forPassId passId: String, withSuccess success: Bool)
}

class WalletOperation: NSObject, PKAddPassesViewControllerDelegate {
  
  var passId: String
  var pass: PKPass?
  var alreadyAdded: Bool
  var resolve: RCTPromiseResolveBlock?
  var reject: RCTPromiseRejectBlock?
  
  weak var delegate: WalletOperationDelegate?
  
  init(forPassWithId id: String, pass: PKPass, alreadyAdded: Bool, delegate: WalletOperationDelegate, resolver resolve: RCTPromiseResolveBlock?, rejecter reject: RCTPromiseRejectBlock?) {
    passId = id
    self.pass = pass
    self.alreadyAdded = alreadyAdded
    self.delegate = delegate
    self.resolve = resolve
    self.reject = reject
  }
  
  func addPassesViewControllerDidFinish(_ controller: PKAddPassesViewController) {
    let signature = "[AppleWallet::addPassesViewControllerDidFinish]"
    OSLog.Wallet.verbose("%@ User is dismissing PKAddPassesViewController instance", signature)
    
    let passLib = PKPassLibrary()
    guard let pass = pass else {
        let message = "Pass library is not available in environment"
        NSLog("\(signature) \(message)")
        reject?(signature, message, nil)
        delegate?.operationHasBeenCompleted(forPassId: passId, withSuccess: false)
        return
    }
    
    if alreadyAdded {
      resolve?(false)
    } else {
      resolve?(passLib.containsPass(pass))
    }

    delegate?.operationHasBeenCompleted(forPassId: passId, withSuccess: true)
    controller.dismiss(animated: true, completion: nil)
  }
}

@objc(AppleWallet)
class AppleWallet: NSObject {
  
  var operationsInCourse = [WalletOperation]()
  
  @objc(canAddPasses:)
  func canAddPasses(_ callback: RCTResponseSenderBlock) {
    callback([PKAddPassesViewController.canAddPasses()])
  }
  
  @objc(addPassWithId:withBase64Data:resolver:rejecter:)
  func addPass(withId passId: String, withBase64Data base64Pass: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let signature = "[AppleWallet::addPass:withBase64Data]"
    NSLog("\(signature) passId: \(passId)")
     
    guard let pass = createPass(fromBase64String: base64Pass) else {
      let message = "Pass library is not available in environment"
      NSLog("\(signature) \(message)")
      reject(signature, message, nil)
      return
    }
    
    guard PKPassLibrary.isPassLibraryAvailable() else {
      let message = "Pass library is not available in environment"
      NSLog("\(signature) \(message)")
      reject(signature, message, nil)
      return
    }
    let passLib = PKPassLibrary()
    let operation = WalletOperation(forPassWithId: passId, pass: pass, alreadyAdded: passLib.containsPass(pass), delegate: self, resolver: resolve, rejecter: reject)
    
    DispatchQueue.main.async { [weak self, operation] in
      self?.displayPreview(forPass: pass, forOperation: operation)
    }
  }
  
  private func createPass(fromBase64String base64String: String) -> PKPass? {
    let signature = "[AppleWallet::createPass:fromBase64String]"
    
    guard let passData = Data(base64Encoded: base64String) else {
      NSLog("\(signature) Failed transforming base64 string into binary data for pass")
      return nil
    }
    
    do {
      return try PKPass(data: passData)
    } catch {
      NSLog("\(signature) Failed parsing binary data into PKPass: \(error)")
      return nil
    }
  }
  
  private func displayPreview(forPass pass: PKPass, forOperation operation: WalletOperation) {
    let signature = "[AppleWallet::displayPreview:forPass]"
    
    guard let addPassesVC = PKAddPassesViewController(pass: pass) else {
      NSLog("\(signature) Could not build PKAddPassesViewController with pass")
      return
    }
    
    addPassesVC.delegate = operation
    operationsInCourse.append(operation)
    presentedController?.present(addPassesVC, animated: true, completion: nil)
  }
  
  private var presentedController: UIViewController? {
    let signature = "[AppleWallet::presentedController]"
    
    guard let rootVC = UIApplication.shared.keyWindow?.rootViewController else {
      NSLog("\(signature) KeyWindow not found. Unable to resolve rootViewController.")
      return nil
    }
    
    return rootVC.presentedViewController ?? rootVC
  }

}

extension AppleWallet: WalletOperationDelegate {
  
  func operationHasBeenCompleted(forPassId passId: String, withSuccess success: Bool) {
    OSLog.Wallet.error("Wallet operation for passId: %@", passId)
    
    guard let operationIndex = operationsInCourse.firstIndex(where: { $0.passId == passId }) else {
      return
    }
    
    operationsInCourse.remove(at: operationIndex)
  }
  
}
