const onReceivedReviewRequest = () => {
  chrome.notifications.create({
    type: 'basic',
    title: 'ghpush',
    message: '新しい Review request があります',
    iconUrl: 'icon128.png',
  })
}

chrome.alarms.create({
  delayInMinutes: 1,
  periodInMinutes: 1,
})

chrome.alarms.onAlarm.addListener(() => {
  onReceivedReviewRequest()
})
