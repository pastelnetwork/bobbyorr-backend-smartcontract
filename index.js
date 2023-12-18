"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.setFCFSAddresses = exports.setFCAddresses = exports.setFCFSSM = exports.setFCSM = void 0;
const client_1 = require("@prisma/client");
const ethers_1 = require("ethers");
const BobbyOrrDrop_json_1 = __importDefault(require("./contracts/BobbyOrrDrop/BobbyOrrDrop.json"));
// AWS.config.update({
//   region: "us-east-1",
//   accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
//   secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
// });
const infuraUrl = process.env.INFURA_URL || "http://localhost:8545/";
console.log(infuraUrl);
const privateKey = process.env.PRIVATE_KEY || "MyPrivateKey";
const prisma = new client_1.PrismaClient();
// const ses = new AWS.SES();
// const ses = new AWS.SESV2();
const provider = new ethers_1.ethers.JsonRpcProvider(infuraUrl);
const signer = new ethers_1.ethers.Wallet(privateKey, provider);
const setFCSM = () => __awaiter(void 0, void 0, void 0, function* () {
    let whiteListUsers = yield prisma.user.findMany({
        where: {
            isFanClub: true,
        },
    });
    const whiteListUserLength = whiteListUsers.length;
    const myContract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop_json_1.default.abi, signer);
    for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
        let array = [];
        for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
            array.push(whiteListUsers[j].id);
        }
        yield myContract.setFanClubSmartmintUsers(array);
    }
});
exports.setFCSM = setFCSM;
const setFCFSSM = () => __awaiter(void 0, void 0, void 0, function* () {
    let whiteListUsers = yield prisma.user.findMany({
        where: {
            isBobby: true,
        },
    });
    const whiteListUserLength = whiteListUsers.length;
    const myContract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop_json_1.default.abi, signer);
    for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
        let array = [];
        for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
            array.push(whiteListUsers[j].id);
        }
        yield myContract.setWhiteListSmartmintUsers(array);
    }
});
exports.setFCFSSM = setFCFSSM;
const setFCAddresses = () => __awaiter(void 0, void 0, void 0, function* () {
    let whiteListAddress = yield prisma.bobbyOrrWhiteList.findMany({
        where: {
            isFanClub: true,
        },
    });
    const myContract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop_json_1.default.abi, signer);
    yield myContract.setFanClubAddresses(whiteListAddress.map((item) => item.id));
});
exports.setFCAddresses = setFCAddresses;
const setFCFSAddresses = () => __awaiter(void 0, void 0, void 0, function* () {
    let whiteListUsers = yield prisma.bobbyOrrWhiteList.findMany({});
    const myContract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop_json_1.default.abi, signer);
    yield myContract.setWhiteListAddresses(whiteListUsers.map((item) => item.id));
});
exports.setFCFSAddresses = setFCFSAddresses;
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.setFCSM)();
        yield (0, exports.setFCFSSM)();
        yield (0, exports.setFCAddresses)();
        yield (0, exports.setFCFSAddresses)();
    }
    catch (error) {
        console.log(error);
    }
});
exports.setup = setup;
(0, exports.setup)();
//# sourceMappingURL=index.js.map