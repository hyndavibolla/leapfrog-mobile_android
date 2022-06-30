//
//  OSLog+Extension.swift
//  ShopYourWayMAX
//
//  Created by Luis Francisco Dzuryk on 05/01/2022.
//

import os.log

extension OSLog {
    private static var subsystem = "\(Bundle.main.bundleIdentifier!).native"

    /// Logs the view cycles like viewDidLoad.
    static let Wallet = OSLog(subsystem: subsystem, category: "Wallet")
  
  func verbose(_ message: StaticString, _ args: CVarArg) {
    os_log(message, log: self, type: .default, args)
  }
  
  func debug(_ message: StaticString, _ args: CVarArg) {
    os_log(message, log: self, type: .debug, args)
  }
  
  func info(_ message: StaticString, _ args: CVarArg) {
    os_log(message, log: self, type: .info, args)
  }
  
  func error(_ message: StaticString, _ args: CVarArg) {
    os_log(message, log: self, type: .error, args)
  }
  
  func fault(_ message: StaticString, _ args: CVarArg) {
    os_log(message, log: self, type: .fault, args)
  }
}
