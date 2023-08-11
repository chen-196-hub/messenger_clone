import { receive, sleep, dec2HexString } from './utils';


let seqNumber = 0 ;
async function send300(device: USBDevice, deviceEp: DeviceEp,  data: number[]) {
  let argData = new Uint8Array(data);
  const dataLen = argData.length;
  const SLOTNUMBER = 0x00;
  let retVal = new Uint8Array( 10 + dataLen );

  retVal[0] = 0x6b ;            // ヘッダー作成
  retVal[1] = 255 & dataLen ;       // length をリトルエンディアン
  retVal[2] = dataLen >> 8 & 255 ;
  retVal[3] = dataLen >> 16 & 255 ;
  retVal[4] = dataLen >> 24 & 255 ;
  retVal[5] = SLOTNUMBER ;        // タイムスロット番号
  retVal[6] = ++seqNumber ;       // 認識番号

  0 != dataLen && retVal.set( argData, 10 ); // コマンド追加
  // console.log(">>>>>>>>>>");
  // console.log(Array.from(retVal).map(v => v.toString(16)));
  const out = await device.transferOut(deviceEp.out, retVal);
  await sleep(50);
}

async function session300(device: USBDevice, deviceEp: DeviceEp) {
  // let rcs300_com_length = 0;
  const len = 50;
  // let header = [];
  // firmware version
  await send300(device, deviceEp, [0xFF, 0x56, 0x00, 0x00]);
  // ['83', '14', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0', '1', '0', 'ff', 'ff', '4', '1', 'ff', 'ff', '1', '0', 'ff', 'ff', '0', '0', '90', '0']
  await receive(device, deviceEp, len);

  // endtransparent
  await send300(device, deviceEp, [0xFF, 0x50, 0x00, 0x00, 0x02, 0x82, 0x00, 0x00]);
  // ['83', '07', '00', '00', '00', '00', '01', '02', '00', '00', 'C0', '03', '00', '90', '00', '90', '00']
  await receive(device, deviceEp , len);
  
  // startransparent
  await send300(device, deviceEp, [0xFF, 0x50, 0x00, 0x00, 0x02, 0x81, 0x00, 0x00]);
  // ['83', '07', '00', '00', '00', '00', '01', '02', '00', '00', 'C0', '03', '00', '90', '00', '90', '00']
  await receive(device, deviceEp, len);

  // rf off
  await send300(device, deviceEp, [0xFF, 0x50, 0x00, 0x00, 0x02, 0x83, 0x00, 0x00]);
  // ['83', '07', '00', '00', '00', '00', '01', '02', '00', '00', 'C0', '03', '00', '90', '00', '90', '00']
  await receive(device, deviceEp, len);

  // rf on
  await send300(device, deviceEp, [0xFF, 0x50, 0x00, 0x00, 0x02, 0x84, 0x00, 0x00]);
  // ['83', '07', '00', '00', '00', '00', '01', '02', '00', '00', 'C0', '03', '00', '90', '00', '90', '00']
  await receive(device, deviceEp, len);

  // SwitchProtocolTypeF
  await send300(device, deviceEp, [0xff, 0x50, 0x00, 0x02, 0x04, 0x8f, 0x02, 0x03, 0x00, 0x00]);
  // ['C0', '03', '00', '90', '00', '90', '00']
  await receive(device, deviceEp, len);

  // ferica poling
  await send300(device, deviceEp, [0xFF, 0x50, 0x00, 0x01, 0x00, 0x00, 0x11, 0x5F, 0x46, 0x04, 0xA0, 0x86, 0x01, 0x00, 0x95, 0x82, 0x00, 0x06, 0x06, 0x00, 0xFF, 0xFF, 0x01, 0x00, 0x00, 0x00, 0x00]);
  // poling検出時 *がIDm
  // ['83', '24', '00', '00', '00', '00', '06', '02', '00', '00']
  // ['C0', '03', '00', '90', '00', '92', '01', '00', '96', '02', '00', '00', '97', '14', '14', '01', '**', '**', '**', '**', '**', '**', '**', '**', '05', '31', '43', '45', '46', '82', 'B7', 'FF', '00', '03', '90', '00']
  // poling未検出時
  // ['83', '07', '00', '00', '00', '00', '98', '02', '00', '00']
  // ['C0', '03', '02', '64', '01', '90', '00']
  const poling_res_f = await receive(device, deviceEp, len);
  if(poling_res_f.length == 46){
    const idm = poling_res_f.slice(26,34).map(v => dec2HexString(v));
    const idmStr = idm.join(' ');
    // idmMessage.innerText = "Card Type: Felica  カードのIDm: " + idmStr;
    // idmMessage.style.display = 'block';
    // waitingMessage.style.display = 'none';
    if (idmStr) {
      return {
        type: 'felica',
        idm: idmStr,
      }
    }
  }
  // SwitchProtocolTypeA
  await send300(device, deviceEp, [0xff, 0x50, 0x00, 0x02, 0x04, 0x8f, 0x02, 0x00, 0x03, 0x00]);
  // ['C0', '03', '00', '90', '00', '90', '00']
  await receive(device, deviceEp, len);
  
  // GET Card UID
  await send300(device, deviceEp, [0xff, 0xCA, 0x00, 0x00]);
  
  // poling検出時 *がIDm
  // ['83', '06', '00', '00', '00', '00', '04', '02', '00', '00']
  // ['**', '**', '**', '**', '90', '00']
  
  // ['83', '07', '00', '00', '00', '00', '41', '02', '00', '00']
  // ['C0', '03', '01', '64', '01', '90', '00']
  // or ['6F', '00']
  const poling_res_a = await receive(device, deviceEp, len);
  if (poling_res_a.length == 16) {
    const id = poling_res_a.slice(10,14).map(v => dec2HexString(v));
    const idStr = id.join(' ');
    // idmMessage.innerText = "Card Type : MIFARE  カードのID: " + idStr;
    // idmMessage.style.display = 'block';
    // waitingMessage.style.display = 'none';
    if (idStr) {
      return {
        type: 'mifare',
        id: idStr,
      }
    }
  }

  // idmMessage.style.display = 'none';
  // waitingMessage.style.display = 'block';
}



// function get_header_length(header){
//   return header[4] << 24 | header[3] << 16 | header[2] << 8 | header[1];
// }


export default session300