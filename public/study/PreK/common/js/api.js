var REF = undefined
function setupRef() {
    const refData = window.sessionStorage.getItem('REF')
    REF = JSON.parse(decodeURIComponent(atob(refData)))
}
setupRef()

const BASE_URL = '/api/study/pre-k'
function getStudyInfo() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/info?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}

function getStudyRecord() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/record?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}

function saveRecord(step, isStudyEnd) {
    const { StudyId, StudentHistoryId } = REF
    const record = {
        studyId: StudyId,
        studentHistoryId: StudentHistoryId,
        step: step.toString(),
        studyEndYn: isStudyEnd ? 'Y': 'N',
        dvc:"N"
    }
    return fetch(`${BASE_URL}/save`, {
        method: 'post',
        body: JSON.stringify(record)
    })
}

function getFERData(data) {
    if(REF && REF.Mode === 'quiz'){
        const ferData = btoa(encodeURIComponent(JSON.stringify({
            type: 'PK',
            unit: '',
            level: 'PK',
            referer: REF.referer,
            language: REF.language,
            data: data
        })))
        return ferData
    }
    return undefined
}

function studyFinish(ferData) {
    window.sessionStorage.removeItem('REF')
    window.sessionStorage.removeItem('apiStudyInfo')
    
    if(ferData){
        window.sessionStorage.setItem('FER', ferData)
        window.location.replace('/study/Result/finish.html')
    }else{
        onExitStudy()
    }
}

function onExitStudy() {
    if(REF && REF.referer){
        window.location.replace(REF.referer)
    }else{
        window.location.replace('/')
    }
}

function onLogoutStudy() {
    if(REF && REF.logoutUrl){
        window.location.replace(REF.logoutUrl)
    }else{
        window.location.replace('/signoff')
    }
}


function sendSms() {
    const { StudyId, StudentHistoryId } = REF
    return fetch(`${BASE_URL}/send-sms?studyId=${StudyId}&studentHistoryId=${StudentHistoryId}`)
}

function checkSession() {
    return fetch(`/api/study/check-session`)
}

let isStartCheckSession = false
let checkSessionFailCount = 0
function loopCheckSession() {
  if(isStartCheckSession){
      execCheckSession()
  }
}

function execCheckSession() {
  checkSession().then(res => {
    if(res.ok){
      return res.json()
    }else{
      throw new Error('Check Session Failed')
    }
  }).then(data => {
    if(data.isPass){
      checkSessionFailCount = 0
      setTimeout(loopCheckSession, 30000)    
    }else{
      isStartCheckSession = false
      alert('Logged out due to another login.')
      onLogoutStudy()
    }
  }).catch(error => {
    checkSessionFailCount++
    if(checkSessionFailCount > 10){
      isStartCheckSession = false
      // alert('Logged out due to inactivity.')
      alert('Session checked fail.')
      onLogoutStudy()
    }else{
      setTimeout(loopCheckSession, 30000) 
    }
  })
}

function startCheckSession() {
    setTimeout(()=> {
      if(REF.User !== 'staff'){
        isStartCheckSession = true
        loopCheckSession()
      }
    }, 1000)
}
startCheckSession()