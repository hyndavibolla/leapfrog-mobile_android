import Foundation
import rzero

@objc(RZeroIntegration)
class RZeroIntegration: NSObject {
  
  @objc static func initialize(withClientToken clientToken: String, andClientId clientId: String) {
    NSLog("[rZero] Initializing RZero with clientId: \(clientId)")
    RZero.initWith(clientToken: clientToken, clientId: clientId, appType: .iOS, staging: true, logging: true)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool { return true }
  
  @objc func sendEventForVisibilityChange(_ path: String, isEntering appear: Bool) -> Void {
    if appear {
      DispatchQueue.main.async {
        NSLog("[rZero] calling logViewAppear(name: \(path))")
        RZero.logViewAppear(name: path)
      }
    } else {
      DispatchQueue.main.async {
        NSLog("[rZero] calling logViewDisappear(name: \(path))")
        RZero.logViewDisappear(name: path)
      }
    }
  }
  
  @objc func logEvent(_ event: String) -> Void {
    DispatchQueue.main.async {
      NSLog("[rZero] calling logEvent(attributes: [event_name: \(event)])")
      RZero.logEvent(attributes: ["event_name": event])
    }

  }
  
  @objc func flush() -> Void {
    DispatchQueue.main.async {
      NSLog("[rZero] calling flush()")
      RZero.flush()
    }
  }
  
  @objc func setUserId(_ userId: String) -> Void {
    DispatchQueue.main.async {
      NSLog("[rZero] calling setUser(\(userId))")
      RZero.setUser(uuid: userId)
    }
  }

}
