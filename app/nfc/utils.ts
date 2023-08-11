
async function sleep(msec: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, msec));
}

async function receive(device: USBDevice,deviceEp: DeviceEp , len: number) {
  // console.log("<<<<<<<<<<" + len);
  let data = await device.transferIn(deviceEp.in, len);
  // console.log(data);
  await sleep(10);
  let arr = [];
  let arr_str = [];
  for (let i = data.data.byteOffset; i < data.data.byteLength; i++) {
    arr.push(data.data.getUint8(i));
    arr_str.push(dec2HexString(data.data.getUint8(i)));
  }
  // console.log(arr_str);
  return arr;
}


function padding_zero(num: string ,p: number){
  return ("0".repeat(p*1) + num).slice(-(p*1));
}
function dec2HexString(n: number) {
  return padding_zero((n*1).toString(16).toUpperCase() ,2);
}


export { sleep, receive, dec2HexString }