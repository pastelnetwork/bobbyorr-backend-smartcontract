import { PrismaClient, User } from "@prisma/client";
import { ethers } from "ethers";
import AWS from "aws-sdk";

import BobbyOrrDrop from "./contracts/BobbyOrrDrop/BobbyOrrDrop.json";

const infuraUrl = process.env.INFURA_URL || "http://localhost:8545/";

console.log(infuraUrl);

const privateKey = process.env.PRIVATE_KEY || "MyPrivateKey";

const prisma = new PrismaClient();
// const ses = new AWS.SESV2();

const provider = new ethers.JsonRpcProvider(infuraUrl);
const signer = new ethers.Wallet(privateKey, provider);

export const sendToFanClubUsers = async () => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
    secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
  });
  const ses = new AWS.SES();

  const fanClubUsers = await prisma.user.findMany({
    where: {
      isFanClub: true,
    },
  });

  console.log("Number of fanClubUsers", fanClubUsers.length);

  let params = {
    Destination: {
      // ToAddresses: fanClubUsers.map((user) => user.email)
      ToAddresses: ["anthony@pastel.network"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<strong>You've been selected as a Fan Club user, giving you early access to purchase one of the first Orr 1,444 Deck NFTs.</strong><br />
          To purchase your NFT, visit our site and login with the details you used to register. Then, simply follow the minting steps and score your first Orr digital trading card!<br />
          Note: As a Fan Club user, you must purchase before December 20 17:59:59 UTC in order to claim your guaranteed spot. While you can still purchase during the Private and Public sales, it will not be guaranteed!<br />
          Need help? Please see <a href="https://www.youtube.com/watch?v=eN43znkOhQ0&amp;feature=youtu.be">here</a> for a  video tutorial explaining how to use a MetaMask wallet so you can snag a piece of history.<br />
          If you have any questions, please reply to this email and we'll be happy to assist you.<br />
          Sincerely,<br />
          <a href="https://www.bobbyorr.io/">The Bobby Orr Collection Team</a>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You've been selected! Purchase your Orr 1,444 Deck Collectible Today!`,
      },
    },
    Source: "Hello@BobbyOrr.io",
  };

  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
};

const sendEmailsToUsers = async (users: User[]) => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESSKEYID || "AWSAccessKeyID",
    secretAccessKey: process.env.AWS_SECRETACCESSKEY || "AWSSecretAccessKey",
  });
  const ses = new AWS.SES();
  let params = {
    Destination: {
      ToAddresses: users.map((user) => user.email),
      // ToAddresses: ["anthony@pastel.network"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<div class=""><div class="aHl"></div><div id=":pr" tabindex="-1"></div><div id=":ph" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd"><div id=":pg" class="a3s aiL "><div dir="ltr"><div class="gmail_quote"><div dir="ltr"><div class="gmail_quote"><div dir="ltr"><div style="text-align:center"><img data-emoji="🏒" style="width: 20px;" class="an1" alt="🏒" aria-label="🏒" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f3d2/32.png" loading="lazy"><font size="4" style="font-family:tahoma,sans-serif"><b style="color:rgb(51,51,51);text-align:left">The&nbsp;<a href="https://www.bobbyorr.io/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.bobbyorr.io/&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw13Q_ptSBM9LoXMHJnmaqGW">Bobby Orr 1444 Deck</a>&nbsp;Public Sale is happening NOW</b></font><img data-emoji="🏒" style="width: 20px;" class="an1" alt="🏒" aria-label="🏒" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f3d2/32.png" loading="lazy"><br></div><div style="text-align:center"><font size="4" face="tahoma, sans-serif"><b style="color:rgb(51,51,51);text-align:left"><br></b></font></div><div style="text-align:center"><font face="tahoma, sans-serif"><img src="https://drive.google.com/uc?export=view&id=1EfqMIYRn19T-AEs3mevUSQUKNsFZg402" alt="image.png" width="503" height="169" data-image-whitelisted="" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 621.484px; top: 183px;"><div id=":rk" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment image.png" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd" data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div><div id=":rl" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Add attachment to Drive image.png" jslog="54185; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 43:WyJpbWFnZS9wbmciLDMyNTg2MF0." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Add to Drive"><div class="akn"><div class="wtScjd J-J5-Ji aYr XG"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div><div id=":rm" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Save a copy to Photos" jslog="54186; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 43:WyJpbWFnZS9wbmciLDMyNTg2MF0." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Save a copy to Photos"><div class="akn"><div class="J-J5-Ji aYr akS"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div></div></font></div><div style="text-align:center"><font face="tahoma, sans-serif"><br></font></div><div style="text-align:left"><p style="margin:0in;line-height:15.75pt"><span style="color:rgb(51,51,51)"><font face="tahoma, sans-serif"><b>Hi Everyone!</b><u></u></font></span></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><span style="color:rgb(51,51,51)">&nbsp;</span><br></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><span style="color:rgb(51,51,51)"><b>The inaugural release of the <a href="https://www.bobbyorr.io/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.bobbyorr.io/&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw13Q_ptSBM9LoXMHJnmaqGW">Bobby Orr Collection</a>, the Orr 1444 Deck, is available to mint now!</b> This is your chance to own a piece of hockey history with limited-edition digital trading cards featuring the legend, Bobby Orr.&nbsp;</span></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><br></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><img data-emoji="🚨" style="width: 18px;" class="an1" alt="🚨" aria-label="🚨" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f6a8/32.png" loading="lazy">&nbsp;<font color="#333333"><span style="font-size:14px">To participate in the <b>Public Sale </b>today, please visit our site <a href="https://www.bobbyorr.io/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.bobbyorr.io/&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw13Q_ptSBM9LoXMHJnmaqGW">here</a>. All you need to do is login, connect your Web3 wallet, and mint!</span></font></font></p><p style="margin:0in;line-height:15.75pt"><font color="#333333" face="tahoma, sans-serif"><span style="font-size:14px"><br></span></font></p><div style="text-align:center"><font face="tahoma, sans-serif"><img src="https://drive.google.com/uc?export=view&id=1P7Xo0SUsuVfzjGATHlAaCXmm6-_ORK6z" alt="BO Static Card Teaser.jpg" width="196" height="193" style="margin-right:0px" data-image-whitelisted="" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 467.984px; top: 550px;"><div id=":rp" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment BO Static Card Teaser.jpg" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd" data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div><div id=":rq" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Add attachment to Drive BO Static Card Teaser.jpg" jslog="54185; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 43:WyJpbWFnZS9qcGVnIiw1NDUyNzRd" data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Add to Drive"><div class="akn"><div class="wtScjd J-J5-Ji aYr XG"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div><div id=":rr" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Save a copy to Photos" jslog="54186; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 4:WyIjbXNnLWY6MTc4NTkyMDg4ODI2MzkwMTg0NSJd; 43:WyJpbWFnZS9qcGVnIiw1NDUyNzRd" data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Save a copy to Photos"><div class="akn"><div class="J-J5-Ji aYr akS"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div></div></font></div><p style="text-align:center;margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><br></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><img data-emoji="🏒" style="width: 20px;" class="an1" alt="🏒" aria-label="🏒" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f3d2/32.png" loading="lazy">&nbsp;&nbsp;<span style="color:rgb(51,51,51);font-size:10.5pt"><i>Dive into a world of exclusive cards</i>, showcasing varied rarity across four tiers: </span><span style="font-size:10.5pt"><font color="#ff0000">Ultra Rare</font></span><span style="color:rgb(51,51,51);font-size:10.5pt">, </span><span style="font-size:10.5pt"><font color="#93c47d">Very Rare</font></span><span style="color:rgb(51,51,51);font-size:10.5pt">, </span><span style="font-size:10.5pt"><font color="#0000ff">Rare</font></span><span style="color:rgb(51,51,51);font-size:10.5pt">, and </span><span style="font-size:10.5pt"><font color="#8e7cc3">Common</font></span><span style="color:rgb(51,51,51);font-size:10.5pt">.&nbsp;</span></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><span style="color:rgb(51,51,51);font-size:10.5pt"><br></span></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><span style="color:rgb(51,51,51);font-size:10.5pt"><img data-emoji="🎨" style="width: 20px;" class="an1" alt="🎨" aria-label="🎨" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f3a8/32.png" loading="lazy">&nbsp;As a collector, you'll gain access to a range of exclusive privileges:</span></font></p><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><br></font></span></p></div><blockquote style="margin:0 0 0 40px;border:none;padding:0px"><div style="text-align:left"><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><img data-emoji="🔴" style="width: 18px;" alt="🔴" aria-label="🔴" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f534/32.png" loading="lazy">&nbsp;A chance for unparalleled experiences, including 1:1 video calls with Bobby Orr</font></span></p></div><div style="text-align:left"><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><img data-emoji="🔵" style="width: 18px;" class="an1" alt="🔵" aria-label="🔵" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f535/32.png" loading="lazy">&nbsp;Opportunities to attend an NHL game alongside Bobby Orr</font></span></p></div><div style="text-align:left"><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><img data-emoji="🟢" style="width: 18px;" class="an1" alt="🟢" aria-label="🟢" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f7e2/32.png" loading="lazy">&nbsp;Signed memorabilia and merchandise</font></span></p></div><div style="text-align:left"><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><img data-emoji="🟣" style="width: 18px;" class="an1" alt="🟣" aria-label="🟣" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f7e3/32.png" loading="lazy">&nbsp;Special edition physical copies of the trading cards</font></span></p></div><div style="text-align:left"><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><img data-emoji="🟠" style="width: 18px;" class="an1" alt="🟠" aria-label="🟠" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f7e0/32.png" loading="lazy">&nbsp;Membership in the Bobby Orr Fan Club</font></span></p></div></blockquote><div style="text-align:left"><div><font face="tahoma, sans-serif"><font color="#333333"><span style="font-size:14px"><br></span></font><font color="#333333"><b>But that's not all!</b>&nbsp;</font><span><font color="#ff0000"><b>The first 444 unique wallets</b></font></span><span style="color:rgb(15,20,25)"> to mint and hold through January 15th, 2023 will each receive a care package including signed merchandise and more!&nbsp;</span></font></div><div><span style="color:rgb(51,51,51);font-size:10.5pt"><font face="tahoma, sans-serif"><br></font></span></div><div><font color="#333333" face="tahoma, sans-serif"><span style="font-size:14px"><b><img data-emoji="🥅" style="width: 18px;" class="an1" alt="🥅" aria-label="🥅" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f945/32.png" loading="lazy">&nbsp;Be sure to score your spot in history and <a href="https://www.bobbyorr.io/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.bobbyorr.io/&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw13Q_ptSBM9LoXMHJnmaqGW">Mint today</a>!</b></span></font></div><div><font color="#333333" face="tahoma, sans-serif"><span style="font-size:14px"><br></span></font></div><p style="margin:0in;line-height:15.75pt"><i><font face="tahoma, sans-serif"><span style="font-size:10.5pt;color:rgb(51,51,51)"><img data-emoji="🤔" style="width: 20px;" class="an1" alt="🤔" aria-label="🤔" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f914/32.png" loading="lazy">&nbsp;Questions about how to mint<img data-emoji="❓" style="width: 20px;" class="an1" alt="❓" aria-label="❓" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/2753/32.png" loading="lazy">&nbsp;Please check out our tutorial&nbsp;</span><a href="https://www.youtube.com/watch?v=eN43znkOhQ0&amp;feature=youtu.be" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.youtube.com/watch?v%3DeN43znkOhQ0%26feature%3Dyoutu.be&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw16exqKC6dIDpxGun8tw2JN">here</a>!&nbsp;</font></i></p><p style="margin:0in;line-height:15.75pt"><i><font face="tahoma, sans-serif"><br></font></i></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif">As always, we are here to help. Let us know if you have any questions!</font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><br></font></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif">--</font></p><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif">Sincerely,<u></u><u></u></font></span></p><p style="margin:0in;line-height:15.75pt"><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif">The Bobby Orr Collection Team</font></span></p><p style="margin:0in;line-height:15.75pt"><img alt="image.png" width="190" height="63" style="font-family:tahoma,sans-serif;text-align:center;margin-right:0px" data-image-whitelisted="" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0." src="https://drive.google.com/uc?export=view&id=1EfqMIYRn19T-AEs3mevUSQUKNsFZg402"></p><p style="margin:0in;line-height:15.75pt"><br></p><p style="margin:0in;line-height:15.75pt"><font face="tahoma, sans-serif"><i>Join our <a href="https://discord.gg/gjVMdXPN3V" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://discord.gg/gjVMdXPN3V&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw1GbB6oOvJQT6kWvtOaGX9J">Discord</a>&nbsp;and Follow us on <a href="https://twitter.com/Orrcollection" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/Orrcollection&amp;source=gmail&amp;ust=1703273286730000&amp;usg=AOvVaw2FQ4nMuqAjtEaY2GZvy-fs">Twitter</a>!&nbsp;</i></font><span style="font-size:10.5pt;color:rgb(51,51,51)"><font face="tahoma, sans-serif"><br></font></span></p></div></div><div class="yj6qo"></div><div class="adL">
</div></div></div><div class="adL">
</div></div></div><div class="adL">
</div></div></div><div id=":qr" class="hq gt a10"><div class="hp"></div>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `🚨 Orr 1444 Deck 🏒 Public Sale is NOW! 👀 Plus + Early Holder Bonus Reward 👀`,
      },
    },
    Source: "BobbyOrr@BobbyOrr.io",
  };

  await ses.sendEmail(params);
};

export const sendToWhiteListUsers = async () => {
  const whiteListUsers = await prisma.user.findMany({
    where: {
      isBobby: true,
    },
  });

  console.log("Number of whiteListUsers", whiteListUsers.length);

  let users: User[] = [];

  for (let i = 0; i < whiteListUsers.length; i += 400) {
    // const temp: User[] = [];
    // for (let j = i; j < i + 400; j++) {
    //   if (j >= whiteListUsers.length) {
    //     break;
    //   }
    // temp.push(whiteListUsers[j]);
    // }
    users.push(whiteListUsers[i]);
  }

  await sendEmailsToUsers(users);
  // await Promise.allSettled(users.map((user) => sendEmailsToUsers(user)));
};

export const setFCSM = async () => {
  let whiteListUsers = await prisma.user.findMany({
    where: {
      isFanClub: true,
    },
  });

  const whiteListUserLength = whiteListUsers.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);
  console.log(
    "setFCSM",
    whiteListUserLength,
    JSON.stringify(whiteListUsers.map((user, index) => ({ index, id: user.id })))
  );

  for (let i = 5; i * 100 < whiteListUserLength; i += 1) {
    let array = [];
    for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
      array.push(whiteListUsers[j].id);
    }

    const tx = await myContract.setFanClubSmartmintUsers(array);

    const response = await tx.wait();
    console.log("response", response);
  }
};

export const setFCFSSM = async () => {
  let whiteListUsers = await prisma.user.findMany({
    where: {
      isBobby: true,
    },
  });

  const whiteListUserLength = whiteListUsers.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);
  console.log("setFCFSSM", whiteListUserLength);

  // for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
  //   let array = [];
  //   for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
  //     array.push(whiteListUsers[j].id);
  //   }

  await myContract.setWhiteListSmartmintUsers(
    whiteListUsers.map((user: any) => user.id),
    {
      gasLimit: 10000000,
    }
  );
  // }
};

export const setFCAddresses = async () => {
  let whiteListAddress = await prisma.bobbyOrrWhiteList.findMany({
    where: {
      isFanClub: true,
    },
  });
  let whiteListUserLength = whiteListAddress.length;

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);
  console.log(
    "setFCSM",
    whiteListUserLength,
    JSON.stringify(whiteListAddress.map((user, index) => ({ index, address: user.address })))
  );

  for (let i = 1; i * 100 < whiteListUserLength; i += 1) {
    let array = [];
    for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
      array.push(whiteListAddress[j].address);
    }
    console.log("setFCAddresses", array);

    const tx = await myContract.setFanClubAddresses(array);

    const response = await tx.wait();
    console.log("response", response);
  }

  // await myContract.setFanClubAddresses(whiteListAddress.map((item) => item.id));
};

export const setFCFSAddresses = async () => {
  let whiteListUsers = await prisma.bobbyOrrWhiteList.findMany({});

  const myContract = new ethers.Contract(process.env.CONTRACT_ADDRESS || "Contract_Address", BobbyOrrDrop.abi, signer);

  let whiteListUserLength = whiteListUsers.length;

  // for (let i = 0; i * 100 < whiteListUserLength; i += 100) {
  //   let array = [];
  //   for (let j = i * 100; j < Math.min(whiteListUserLength, (i + 1) * 100); j++) {
  //     array.push(whiteListUsers[j].address);
  //   }
  //   console.log("setFCFSAddresses", array);

  await myContract.setWhiteListAddresses(
    whiteListUsers.map((user) => user.address),
    {
      gasLimit: 20000000,
    }
  );
  // }
  // await myContract.setWhiteListAddresses(whiteListUsers.map((item) => item.id));
};

export const setup = async () => {
  try {
    // await setFCAddresses();
  } catch (error) {
    console.log(error);
  }
};
//
// setup();
