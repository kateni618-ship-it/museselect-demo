const storageKey = "muselandBoostState";

const defaults = {
  onboardingSeen: false,
  mineFirstSaleSeen: false,
  firstSaleRewardSeen: false,
  monthlyBoostSeen: false,
  stage: "new",
  ordersThisMonth: 0,
  gmvThisMonth: 0,
  cashBonusEarned: 0
};

function loadState() {
  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(storageKey) || "{}") };
  } catch {
    return { ...defaults };
  }
}

export const boostState = loadState();

export function saveBoostState(updates = {}) {
  Object.assign(boostState, updates);
  window.localStorage.setItem(storageKey, JSON.stringify(boostState));
}

export function setBoostStage(stage) {
  const stageMap = {
    new: {
      stage: "new",
      mineFirstSaleSeen: false,
      firstSaleRewardSeen: false,
      monthlyBoostSeen: false,
      ordersThisMonth: 0,
      gmvThisMonth: 0,
      cashBonusEarned: 0
    },
    firstSaleDone: {
      stage: "firstSaleDone",
      mineFirstSaleSeen: true,
      firstSaleRewardSeen: false,
      monthlyBoostSeen: false,
      ordersThisMonth: 1,
      gmvThisMonth: 78,
      cashBonusEarned: 5
    },
    monthlyDone: {
      stage: "monthlyDone",
      mineFirstSaleSeen: true,
      firstSaleRewardSeen: true,
      monthlyBoostSeen: false,
      ordersThisMonth: 15,
      gmvThisMonth: 520,
      cashBonusEarned: 35
    }
  };
  saveBoostState(stageMap[stage] || stageMap.new);
}
