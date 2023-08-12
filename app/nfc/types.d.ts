interface USBInTransferResult {
  data: DataView;
  status: string;
}

declare interface USBDevice {
  open(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  transferOut(endpointNumber: number, data: ArrayBuffer): Promise<void>;
  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
  close(): void;
  configuration: {
    interfaces: {
      alternate: {
        interfaceClass: number;
        endpoints: {
          direction: string;
          endpointNumber: number;
        }[];
      };
      interfaceNumber: number;
    }[];
  };
  productId: number;
}

interface DeviceEp {
  in: number;
  out: number;
}


declare interface USB {
  getDevices(): Promise<USBDevice[]>;
  requestDevice(options: { filters: DeviceFilter[] }): Promise<USBDevice>;
}

declare interface NavigatorUSB {
  readonly usb: USB;
}

declare interface Navigator extends NavigatorUSB {}
declare const navigator: Navigator;

type DeviceModelList = Record<number, number>;

interface DeviceFilter {
  vendorId: number;
  productId: number;
  deviceModel: number;
}
