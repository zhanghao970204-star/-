import request from "@/utils/index";
import { normalizeCountryCode } from "@/utils/country";

// 1.登录接口
export function Login(data) {
  return request.post("/login/login", data);
}
export function Register(data) {
  return request.post("/register/register", data);
}
//退出登录
export function Logout(data) {
  return request.post("/logout", data);
}

//初始化
export function Init(data) {
  return request.post("/profile/init", data);
}
// 获取banner列表
export function GetBannerList(data) {
  return request.post("/home/page/banner/list", data);
}
export function GetCsLink(data) {
  return request.post("/getCsLink", data);
}
export function GetHomeGameList(data) {
  return request.post("/game/getHomeGameList", data);
}
// 游戏素材/预览图列表 GET
export function GetGameMaterialList(params) {
  return request.get("/game/getGameMaterialList", { params });
}
export function SystemAnnouncement(data) {
  return request.post("/promo/systemAnnouncement", data);
}
export function NoticeList(data) {
  return request.post("/system/noticeList", data);
}
export function NoticeDetails(data) {
  return request.post("/noticeDetails", data);
}
export function NoticeReadAll(data) {
  return request.post("/system/notice/readAll", data);
}
export function NoticeDeleteRead(data) {
  return request.post("/system/notice/deleteRead", data);
}
export function GetPromoRule(data) {
  return request.post("/activity/getPromoRule", data);
}
export function RedPacket(data) {
  return request.post("/activity/redPacket", data);
}
export function GetRedPacket(data) {
  return request.post("/activity/getRedPacket", data);
}
export function RedPacketReceiveRecord(data) {
  return request.post("/activity/redPacketReceiveRecord", data);
}
export function GameBalanceList(data) {
  return request.post("/gameBalanceList", data);
}
export function GetSubUserList(data) {
  return request.post("/agent/getSubUserList", data);
}
export function GetHomeWinningGameList(data) {
  return request.post("/game/getHomeWinningGameList", data);
}
export function GetPromoDailyRelief(data) {
  return request.post("/promo/getPromoDailyRelief", data);
}
export function GetTeamRebateInit(data) {
  return request.post("/promo/getTeamRebateInit", data);
}
export function GetVipAwardInit(data) {
  return request.post("/activity/getVipAwardInit", data);
}
export function GetSignIn(data) {
  return request.post("/activity/getSignIn", data);
}
export function GetSignDaily(data) {
  return request.post("/activity/getSignDaily", data);
}
export function SignDaily(data) {
  return request.post("/activity/signDaily", data);
}
export function VnRechargeInitS(data) {
  return request.post("/recharge/vnRechargeInitS", data);
}
export function WithdrawInit(data) {
  return request.post("/withdraw/init", data);
}
export function AddBankCardInit(data) {
  return request.post("/profile/addBankCardInit", data);
}
export function AddBankCard(data) {
  return request.post("/profile/addBankCard", data);
}
export function RealnameCert(data) {
  return request.post("/profile/realnameCert", data);
}
export function ChangePrivacyPwd(data) {
  return request.post("/security/changePrivacyPwd", data);
}
export function CapitalDetails(data) {
  return request.post("/capital/capitalDetails", data);
}
export function VipInit(data) {
  return request.post("/vip/init", data);
}
export function ChangeLoginPwd(data) {
  return request.post("/security/changeLoginPwd", data);
}
export function GetCaptcha(data) {
  return request.post("/security/getCaptcha", data);
}
export function LoginCaptcha(data) {
  return request.post("/login/loginCaptcha", data);
}
export function GetSysConfig(data) {
  return request.post("/system/sysConfig", data);
}
export function BankCardInfo(data) {
  return request.post("/profile/bankCardInfo", data);
}
export function DelBankCard(data) {
  return request.post("/profile/delBankCard", data);
}
export function SetHeadUrl(data) {
  return request.post("/setHeadUrl", data);
}
export function GetTeamReports(data) {
  return request.post("/agent/getTeamReports", data);
}
export function GetTeamTotalReports(data) {
  return request.post("/agent/getTeamTotalReports", data);
}
export function GetThirdGameBetRecord(data) {
  return request.post("/game/getThirdGameBetRecord", data);
}
export function ForwardGame(data) {
  return request.post("/game/forwardGame", data);
}
export function ReportPromoPanelEvent(data) {
  return request.post("/promo/reportPromoPanelEvent", data);
}
export function GetLuckyRoulette(data) {
  return request.post("/promo/getLuckyRoulette", data);
}
export function LuckyRoulette(data) {
  return request.post("/promo/luckyRoulette", data);
}
export function GetLuckyRouletteRecord(data) {
  return request.post("/promo/getLuckyRouletteRecord", data);
}
export function TreasureReceiveInit(data) {
  return request.post("/promo/treasureReceiveInit", data);
}
export function ReceiveTreasure(data) {
  return request.post("/promo/receiveTreasure", data);
}
export function Pay(data) {
  return request.post("/recharge/pay", data);
}
export function Withdraw(data) {
  return request.post("/withdraw/withdraw", data);
}
export function ReceivePromoReliefAmount(data) {
  return request.post("/promo/receivePromoReliefAmount", data);
}
export function ReceiveTeamRebateAmount(data) {
  return request.post("/promo/receiveTeamRebateAmount", data);
}
export function GetVipAward(data) {
  return request.post("/activity/getVipAward", data);
}
export function SignIn(data) {
  return request.post("/activity/signIn", data);
}
export function ReceiveLuckyRouletteBonus(data) {
  return request.post("/promo/receiveLuckyRouletteBonus", data);
}
export function GetLuckyRouletteLatestAwards(data) {
  return request.post("/promo/getLuckyRouletteLatestAwards", data);
}
//facebook上报
export function GetIsFbReport(data) {
  return request.post("/getIsFbReport", data);
}
export function fbReportSuccess(data) {
  return request.post("/fbReportSuccess", data);
}

export function GetRWHistory(data) {
  return request.post("/capital/getRWHistory", data);
}

/** 其他账变：活动赠送 / 返佣 / 返水 / 系统加减款等（不含充值提现投注） */
export function GetOtherDealHistory(data) {
  return request.post("/capital/getOtherDealHistory", data);
}

export function ActivitygetRegisterAward(data) {
  return request.post("/activity/getRegisterAward", data);
}

export function ActivityreceiveRegisterAward(data) {
  return request.post("/activity/receiveRegisterAward", data);
}

export function GetUserGameRecordList(data) {
  return request.post("/game/getUserGameRecordList", data);
}
export function MainInit(data) {
  return request.post("/main/init", data);
}
export function LotteryInit(data) {
  return request.post("/lottery/init", data);
}
export function LotteryBetV2(data) {
  return request.post("/lottery/betV2", data);
}
export function GetNGNDrawHistory(data) {
  return request.post("/lottery/getNGNDrawHistory", data);
}
export function GetTodayBetRecord(data) {
  return request.post("/lottery/getTodayBetRecord", data);
}
export function GetBetList(data) {
  return request.post("/lottery/getBetList", data);
}
export function BetDetail(data) {
  return request.post("/betDetail", data);
}
export function CancelBet(data) {
  return request.post("/agent/risk/cancelBet", data);
}
export function GetServerDateTime(data) {
  return request.post("/lottery/getServerDateTime", data);
}
export function GetBRDrawHistory(data) {
  return request.post("/lottery/getBRDrawHistory", data);
}
export function FreshIssueInfo(data) {
  return request.post("/lottery/freshIssueInfo", data);
}
export function GetHomeWinningLottoList(data) {
  return request.post("/game/getHomeWinningLottoList", data);
}
export function GetLotteryLatestResults(data) {
  return request.post("lottery/getLotteryLatestResults", data);
}
export function GetLotteryList(data) {
  return request.post("/main/getLotteryList", data);
}
export function LastOrderDetail(data) {
  return request.post("/lastOrderDetail", data);
}
export function RefreshExchangeRate(data) {
  return request.post("/refreshExchangeRate", data);
}
export function UpayStatusorderNo(data) {
  return request.post("/recharge/upayStatus", data);
}
export function GetPlatformList(data) {
  return request.post("/getPlatformList", data).then((res) => {
    if (res && res.content && Array.isArray(res.content.list)) {
      res.content.list = res.content.list.map((item) => {
        if (!item || item.country == null) return item;
        return { ...item, country: normalizeCountryCode(item.country) };
      });
    }
    return res;
  });
}
export function GetInvitationID(data) {
  return request.post("/getInvitationID", data);
}
export function NewPlayerGiftPackInit(data) {
  return request.post("/promo/newPlayerGiftPackInit", data);
}
export function ReceiveNewPlayerGiftPack(data) {
  return request.post("/promo/receiveNewPlayerGiftPack", data);
}
export function TreasureBoxInit(data) {
  return request.post("/promo/treasureBoxInit", data);
}
export function TaskCenterNewbieInit(data) {
  return request.post("/promo/taskCenterNewbieInit", data);
}
export function TaskCenterDailyInit(data) {
  return request.post("/promo/taskCenterDailyInit", data);
}
export function TaskCenterWeeklyInit(data) {
  return request.post("/promo/taskCenterWeeklyInit", data);
}
export function ClaimTaskReward(data) {
  return request.post("/promo/claimTaskReward", data);
}
export function ClaimProgressReward(data) {
  return request.post("/promo/claimProgressReward", data);
}

// VIP
export function CashBackInit(data) {
  return request.post("/activity/cashBackInit", data);
}
export function GetCashBack(data) {
  return request.post("/activity/getCashBack", data);
}
export function ChangeExtend(data) {
  return request.post("/profile/changeExtend", data);
}
export function BirthdayAwardInit(data) {
  return request.post("/vip/birthdayAwardInit", data);
}
export function ReceiveBirthdayAward(data) {
  return request.post("/vip/receiveBirthdayAward", data);
}

// Google OAuth
export function GetGoogleAuthorizingUrl(data) {
  return request.post("/login/getGoogleAuthorizingUrl", data);
}
export function GoogleAuthCodeLogin(data) {
  return request.post("/login/googleAuthCodeLogin", data);
}
export function GoogleRegister(data) {
  return request.post("/register/googleRegister", data);
}
export function BindPhone(data) {
  return request.post("/profile/bindPhone", data);
}
export function ChangeMail(data) {
  return request.post("/profile/changeMail", data);
}
