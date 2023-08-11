declare interface USBDevice {
  open(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
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

declare interface USB {
  getDevices(): Promise<USBDevice[]>;
  requestDevice(options: { filters: DeviceFilter[] }): Promise<USBDevice>;
}

declare interface NavigatorUSB {
  readonly usb: USB;
}

declare interface Navigator extends NavigatorUSB {}

type DeviceModelList = Record<number, number>;


type EndpointNumbers = {
  in: number;
  out: number;
};


async function sleep(msec: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, msec));
}

interface DeviceFilter {
  vendorId: number;
  productId: number;
  deviceModel: number;
}


const deviceFilters: DeviceFilter[] = [
  {
    vendorId: 0x054c,
    productId: 0x06C1,
    deviceModel: 380,
  },
  {
    vendorId: 0x054c,
    productId: 0x06C3,
    deviceModel: 380,
  },
  {
    vendorId: 0x054c,
    productId: 0x0dc8,
    deviceModel: 300,
  },
  {
    vendorId: 0x054c,
    productId: 0x0dc9,
    deviceModel: 300,
  },
];
const deviceModelList: DeviceModelList= {
  0x06C1: 380,
  0x06C3: 380,
  0x0dc8: 300,
  0x0dc9: 300,
};
let deviceModel;
let deviceEp = {
  in: 0,
  out: 0,
}
let seqNumber = 0 ;


const getNfc =async () => {
  let device;
  try {
    console.log(navigator);
    // ペアリング済みの対応デバイスが1つだったら、自動選択にする
    let pairedDevices = await navigator.usb.getDevices();
    pairedDevices = pairedDevices.filter(d => deviceFilters.map(p => p.productId).includes(d.productId));
    // 自動選択 or 選択画面
    device = pairedDevices.length == 1 ? pairedDevices[0] : await navigator.usb.requestDevice({ filters: deviceFilters});
    deviceModel = deviceModelList[device.productId];
    console.log("open");
    await device.open();
    console.log(device);
  } catch (e) {
    console.log(e);
    alert(e);
    throw e;
  }
  try {
    console.log("selectConfiguration");
    await device.selectConfiguration(1);
    console.log("claimInterface");
    console.log(device);
    const nfcInterface = device.configuration.interfaces.filter(v => v.alternate.interfaceClass == 255)[0];
    await device.claimInterface(nfcInterface.interfaceNumber);
    deviceEp = {
      in: nfcInterface.alternate.endpoints.filter(e => e.direction == 'in')[0].endpointNumber,
      out: nfcInterface.alternate.endpoints.filter(e => e.direction == 'out')[0].endpointNumber,
    }
    // startButton.style.display = 'none';
    // waitingMessage.style.display = 'block';
    do {
      // deviceModel == 300 ? await session300(device) : await session380(device);
      await sleep(100);
    } while (true);
  } catch (e) {
    console.log(e);
    alert(e);
    try {
      device.close();
    } catch (e) {
      console.log(e);
    }
    // startButton.style.display = 'block';
    // waitingMessage.style.display = 'none';
    // idmMessage.style.display = 'none';
    throw e;
  }
}


export default getNfc