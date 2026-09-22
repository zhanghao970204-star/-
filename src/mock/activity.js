const STORAGE_KEY_REGISTER = 'checkin_register_signed'
const STORAGE_KEY_DEPOSIT = 'checkin_deposit_signed'
const STORAGE_KEY_WEEK = 'checkin_week_start'

function getWeekStart() {
  const now = new Date()
  const day = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - day + 1)
  monday.setHours(0, 0, 0, 0)
  return monday.getTime()
}

function resetIfNewWeek() {
  const currentWeekStart = getWeekStart()
  const savedWeekStart = parseInt(localStorage.getItem(STORAGE_KEY_WEEK) || '0')
  if (savedWeekStart !== currentWeekStart) {
    localStorage.setItem(STORAGE_KEY_WEEK, currentWeekStart.toString())
    localStorage.removeItem(STORAGE_KEY_REGISTER)
    localStorage.removeItem(STORAGE_KEY_DEPOSIT)
  }
}

function getSavedDays(key) {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : []
}

function saveDays(key, days) {
  localStorage.setItem(key, JSON.stringify(days))
}

function getCurrentDayOfWeek() {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
}

export function getCheckInData() {
  resetIfNewWeek()
  const currentDay = getCurrentDayOfWeek()
  return {
    registerCheckIn: {
      currentDay,
      signedDays: getSavedDays(STORAGE_KEY_REGISTER),
      rewards: [
        { day: 1, amount: 20 },
        { day: 2, amount: 40 },
        { day: 3, amount: 40 },
        { day: 4, amount: 60 },
        { day: 5, amount: 80 },
        { day: 6, amount: 80 },
        { day: 7, amount: 120 }
      ]
    },
    depositCheckIn: {
      isDeposited: !!localStorage.getItem('isDeposited'),
      currentDay,
      signedDays: getSavedDays(STORAGE_KEY_DEPOSIT),
      rewards: [
        { day: 1, amount: 40 },
        { day: 2, amount: 80 },
        { day: 3, amount: 80 },
        { day: 4, amount: 120 },
        { day: 5, amount: 120 },
        { day: 6, amount: 160 },
        { day: 7, amount: 220 }
      ]
    }
  }
}

export function doRegisterCheckIn(day) {
  resetIfNewWeek()
  const days = getSavedDays(STORAGE_KEY_REGISTER)
  if (!days.includes(day)) {
    days.push(day)
    saveDays(STORAGE_KEY_REGISTER, days)
  }
  return days
}

export function doDepositCheckIn(day) {
  resetIfNewWeek()
  const days = getSavedDays(STORAGE_KEY_DEPOSIT)
  if (!days.includes(day)) {
    days.push(day)
    saveDays(STORAGE_KEY_DEPOSIT, days)
  }
  return days
}

export const mockActivityList = [
  {
    id: 'dailyCheckIn',
    type: 'checkin',
    route: '/dailyCheckIn'
  },
  {
    id: 'inviteEarn',
    type: 'invite',
    route: '/referFriend'
  },
  {
    id: 'cashRain',
    type: 'cashrain',
    route: '/redPacket'
  }
]
