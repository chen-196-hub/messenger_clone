import { sleep } from './utils';
import session300 from './session300';
import session380 from './session380';


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

const getNfc = async () => {
  let deviceEp = {
    in: 0,
    out: 0,
  }
  let device: USBDevice ;
  try {
    // console.log(navigator);
    // ペアリング済みの対応デバイスが1つだったら、自動選択にする
    let pairedDevices = await navigator.usb.getDevices();
    pairedDevices = pairedDevices.filter(d => deviceFilters.map(p => p.productId).includes(d.productId));
    // 自動選択 or 選択画面
    device = pairedDevices.length == 1 ? pairedDevices[0] : await navigator.usb.requestDevice({ filters: deviceFilters});
    deviceModel = deviceModelList[device.productId];
    // console.log("open");
    await device.open();
    // console.log(device);
  } catch (e) {
    // console.log(e);
    alert(e);
    throw e;
  }
  try {
    // console.log("selectConfiguration");
    await device.selectConfiguration(1);
    // console.log("claimInterface");
    // console.log(device);
    const nfcInterface = device.configuration.interfaces.filter(v => v.alternate.interfaceClass == 255)[0];
    await device.claimInterface(nfcInterface.interfaceNumber);
    deviceEp = {
      in: nfcInterface.alternate.endpoints.filter(e => e.direction == 'in')[0].endpointNumber,
      out: nfcInterface.alternate.endpoints.filter(e => e.direction == 'out')[0].endpointNumber,
    }
    // startButton.style.display = 'none';
    // waitingMessage.style.display = 'block';
    do {
      const res = deviceModel == 300 ? await session300(device, deviceEp) : await session380(device, deviceEp);
      console.log(res);
      if (res) {
        return res;
      }
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