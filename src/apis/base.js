import axios from 'axios';
import protobuf from 'protobufjs';

const BASE_URL = 'http://192.168.0.106:8080/api/v1/';

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/x-protobuf',
    },
    responseType: 'arraybuffer',
});

/**
 * 移除 object 中指定的 key
 */
 const omit = (obj, uselessKeys) => 
 Object.keys(obj).reduce((acc, key) => {
     return uselessKeys.includes(key) ?
     acc :
     {...acc, key: obj[key]}
 }, {});


/**
* 根据 proto 文件导入后的路径获取 message 类型名称
* 要求文件名与主要 message 同名
*/
const getProtoName = (path) => {
 const start = path.lastIndexOf("/") + 1;
 const end = path.indexOf(".");
 return path.substring(start, end);
};


/**
 * 对 protobuf 协议的 response.data 进行解码, 转换成对象返回
 */
instance.interceptors.response.use(async (response) => {
    const { config } = response;
    const { pb } = config;

    if (pb.response && response.data) {
        const root = await protobuf.load(pb.response)
        const msgType = root.lookupType(getProtoName(pb.response));
        const msg = msgType.decode(new Uint8Array(response.data));
        const newData = msgType.toObject(msg);
        const newRes = omit(response, ["data"]);
        return {
            ...newRes,
            data: newData,
        };
    }
    return response;
});

export default instance;