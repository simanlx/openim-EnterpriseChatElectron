import file_pdf from "@/assets/images/file_pdf.png";
import file_pic from "@/assets/images/file_pic.png";
import file_ppt from "@/assets/images/file_ppt.png";
import file_unknow from "@/assets/images/file_unknow.png";
import file_world from "@/assets/images/file_world.png";
import file_xslx from "@/assets/images/file_xslx.png";
import file_zip from "@/assets/images/file_zip.png";
import { RcFile } from "antd/lib/upload";
import axios from "axios";
import { Participant, Track } from "livekit-client";

export const findEmptyValue = (obj: any) => {
  let flag = true;
  for (let key in obj) {
    if (obj[key] === "") {
      flag = false;
    }
  }
  return flag;
};

export const pySegSort = (arr: any[]) => {
  if (arr.length == 0) return;
  if (!String.prototype.localeCompare) return null;
  var letters = "#ABCDEFGHIJKMNOPQRSTWXYZ".split("");
  var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");
  var segs: any = []; // 存放数据
  var res: any = {};
  let curr: any;
  var re = /[^\u4e00-\u9fa5]/; //中文正则
  var pattern = new RegExp("[`\\-~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？12345678990]"); //特殊符号

  letters.filter((items, i) => {
    curr = {
      initial: "", //字母
      data: [], //数据
    };
    arr.map((v, index) => {
      // 特殊字符
      if (pattern.test(v?.nickname[0])) {
        if ((!zh[i - 1] || zh[i - 1].localeCompare(v?.nickname) <= 0) && v?.nickname.localeCompare(zh[i]) == -1) {
          curr.data.push(v);
        }
      }
      // 判断首个字是否是中文
      if (re.test(v?.nickname[0])) {
        // 英文
        if (v?.nickname[0].toUpperCase() == items) {
          curr.data.push(v);
        }
      } else {
        // 中文
        if ((!zh[i - 1] || zh[i - 1].localeCompare(v?.nickname) <= 0) && v?.nickname.localeCompare(zh[i]) == -1) {
          curr.data.push(v);
        }
      }
    });
    if (curr.data.length) {
      curr.initial = letters[i];
      segs.push(curr);
      curr.data.sort((a: any, b: any) => {
        return a.nickname.localeCompare(b.nickname);
      });
    }
  });
  res.segs = Array.from(new Set(segs)); //去重
  const lastData = res.segs.shift();
  res.segs.push(lastData);
  return res;
};

export const formatDate = (timestamp: number) => {
  const now = new Date(timestamp);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  let minute: any = now.getMinutes();
  if (minute.toString().length === 1) minute = "0" + minute;
  let second: any = now.getSeconds();
  if (second.toString().length === 1) second = "0" + second;
  const str1 = year + "-" + month + "-" + date;
  // const str2 = hour + ":" + minute + ":" + second
  const str2 = hour + ":" + minute;
  return [year, month, date, str1, str2];
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getUserIP = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    var RTCPeerConnection = window.RTCPeerConnection;
    if (RTCPeerConnection) {
      var rtc = new RTCPeerConnection({ iceServers: [] });
      // @ts-ignore
      rtc.createDataChannel("", { reliable: false });
      rtc.onicecandidate = function (evt) {
        if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
      };
      rtc.createOffer(
        function (offerDesc) {
          grepSDP(offerDesc.sdp);
          rtc.setLocalDescription(offerDesc);
        },
        function (e) {
          console.warn("offer failed", e);
        }
      );
      var addrs = Object.create(null);
      addrs["0.0.0.0"] = false;
      function updateDisplay(newAddr: any) {
        if (newAddr in addrs) return;
        else addrs[newAddr] = true;
        var displayAddrs = Object.keys(addrs).filter(function (k) {
          return addrs[k];
        });
        for (var i = 0; i < displayAddrs.length; i++) {
          if (displayAddrs[i].length > 16) {
            displayAddrs.splice(i, 1);
            i--;
          }
        }
        resolve(displayAddrs[0]);
      }
      function grepSDP(sdp: any) {
        var hosts = [];
        sdp.split("\r\n").forEach(function (line: any, index: any, arr: any) {
          if (~line.indexOf("a=candidate")) {
            const parts = line.split(" ");
            const addr = parts[4];
            const type = parts[7];
            if (type === "host") updateDisplay(addr);
          } else if (~line.indexOf("c=")) {
            const parts = line.split(" ");
            const addr = parts[2];
            updateDisplay(addr);
          }
        });
      }
    } else {
      reject("none");
    }
  });
};

export const bytesToSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  var k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};

export const switchFileIcon = (suffix: string) => {
  const imageSuffixs = ["jpeg", "tiff", "png", "gif", "jpg", "gif"];
  const pptSuffixs = ["ppt", "pptx"];
  const exelceSuffixs = ["xlsx", "xls"];
  const worldSuffixs = ["doc", "docx"];
  const zipSuffixs = ["rar", "zip"];

  if (imageSuffixs.includes(suffix)) {
    return file_pic;
  } else if (pptSuffixs.includes(suffix)) {
    return file_ppt;
  } else if (exelceSuffixs.includes(suffix)) {
    return file_xslx;
  } else if (worldSuffixs.includes(suffix)) {
    return file_world;
  } else if (zipSuffixs.includes(suffix)) {
    return file_zip;
  } else if (suffix === "pdf") {
    return file_pdf;
  } else {
    return file_unknow;
  }
};

export const getPicInfo = (file: RcFile): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = _URL.createObjectURL(file);
  });
};

export const getVideoInfo = (file: RcFile): Promise<number> => {
  return new Promise((resolve, reject) => {
    const Url = URL.createObjectURL(file);
    const vel = new Audio(Url);
    vel.onloadedmetadata = function () {
      resolve(vel.duration);
    };
  });
};

export const base64toFile = (base64Str: string) => {
  var arr = base64Str.split(","),
    fileType = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `screenshot${Date.now()}.png`, {
    type: fileType,
  });
};

export const contenteditableDivRange = () => {
  const selection = window.getSelection(),
    range = selection!.getRangeAt(0),
    br = document.createElement("br"),
    textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
  range.deleteContents(); //required or not?
  range.insertNode(br);
  range.collapse(false);
  range.insertNode(textNode);
  range.selectNodeContents(textNode);
  selection!.removeAllRanges();
  selection!.addRange(range);
  document.execCommand("delete");
};

export const move2end = (ref: React.RefObject<HTMLDivElement>) => {
  const sel = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(ref.current!);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
};

export const downloadFileUtil = (filePath: string, filename: string) => {
  axios
    .get(filePath, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "blob",
    })
    .then(function (response) {
      const blob = new Blob([response.data]);
      const fileName = filename;
      const linkNode = document.createElement("a");
      linkNode.download = fileName;
      linkNode.style.display = "none";
      linkNode.href = URL.createObjectURL(blob);
      document.body.appendChild(linkNode);
      linkNode.click();
      URL.revokeObjectURL(linkNode.href);
      document.body.removeChild(linkNode);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const sec2Format = (seconds: number, dateFormat = "H:i:s") => {
  var obj: any = {};
  //@ts-ignore
  obj.H = Number.parseInt(seconds / 3600);
  //@ts-ignore
  obj.i = Number.parseInt((seconds - obj.H * 3600) / 60);
  //@ts-ignore
  obj.s = Number.parseInt(seconds - obj.H * 3600 - obj.i * 60);
  if (obj.H < 10) {
    obj.H = "0" + obj.H;
  }
  if (obj.i < 10) {
    obj.i = "0" + obj.i;
  }
  if (obj.s < 10) {
    obj.s = "0" + obj.s;
  }
  return dateFormat.replace("H", obj.H).replace("i", obj.i).replace("s", obj.s);
};

type WaterMarkConfig = {
  container?: HTMLElement;
  width?: string;
  height?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  font?: string;
  fillStyle?: string;
  content?: string;
  rotate?: number;
  zIndex?: number;
};

export const watermark = (config: WaterMarkConfig) => {
  const {
    container = document.body,
    width = "300px",
    height = "200px",
    textAlign = "center",
    textBaseline = "middle",
    font = "16px Microsoft Yahei",
    fillStyle = "rgba(184, 184, 184, 0.4)",
    content="",
    rotate=24,
    zIndex="1000",
  } = config;
  const canvas = document.createElement("canvas");

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");

  ctx!.textAlign = textAlign;
  ctx!.textBaseline = textBaseline;
  ctx!.font = font;
  ctx!.fillStyle = fillStyle;
  ctx!.rotate((Math.PI / 180) * rotate);
  ctx!.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

  const base64Url = canvas.toDataURL();
  const __wm = document.querySelector(".__wm");

  const watermarkDiv = __wm || document.createElement("div");
  const styleStr = `
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:${zIndex};
  pointer-events:none;
  background-repeat:repeat;
  background-image:url('${base64Url}')`;

  watermarkDiv.setAttribute("style", styleStr);
  watermarkDiv.classList.add("__wm");

  if (!__wm) {
    container.style.position = "relative";
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  if (MutationObserver) {
    let mo = new MutationObserver(function () {
      const __wm = document.querySelector(".__wm");
      if ((__wm && __wm.getAttribute("style") !== styleStr) || !__wm) {
        mo.disconnect();
        //@ts-ignore
        mo = null;
        watermark(JSON.parse(JSON.stringify(config)));
      }
    });

    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
};
