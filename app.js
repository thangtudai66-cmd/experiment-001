(() => {
  const STORAGE_KEY = 'fitness-data-v1'

  const $ = id => document.getElementById(id)
  const checkBtn = $('checkBtn')
  const streakEl = $('streak')
  const statusEl = $('todayStatus')
  const logInput = $('logInput')
  const protein = $('protein')
  const carbs = $('carbs')
  const fat = $('fat')
  const exercise = $('exercise')
  const foodCal = $('foodCal')
  const netCal = $('netCal')

  function readStore(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }catch(e){return {}}
  }
  function writeStore(obj){ localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)) }

  function todayKey(d = new Date()){
    return d.toISOString().slice(0,10)
  }

  function getDay(key){
    const s = readStore()
    return s[key] || null
  }

  function saveDay(key, data){
    const s = readStore()
    s[key] = Object.assign({}, s[key]||{}, data)
    writeStore(s)
  }

  function calcStreak(){
    const s = readStore()
    let count = 0
    let d = new Date()
    while(true){
      const k = todayKey(d)
      if(s[k] && s[k].checked){ count++; d.setDate(d.getDate()-1); continue }
      break
    }
    return count
  }

  function calcFoodCalories(){
    const p = Number(protein.value || 0)
    const c = Number(carbs.value || 0)
    const f = Number(fat.value || 0)
    return Math.round(p*4 + c*4 + f*9)
  }

  function updateCaloriesUI(){
    const food = calcFoodCalories()
    const ex = Number(exercise.value || 0)
    foodCal.textContent = food
    netCal.textContent = Math.round(food - ex)
  }

  function refreshUI(){
    const key = todayKey()
    const day = getDay(key)
    const streak = calcStreak()
    streakEl.textContent = `连续打卡：${streak} 天`
    if(day && day.checked){
      checkBtn.classList.add('checked')
      statusEl.textContent = '今天已打卡 ✓'
    }else{
      checkBtn.classList.remove('checked')
      statusEl.textContent = ''
    }
    logInput.value = (day && day.log) || ''
    protein.value = (day && day.protein) || 0
    carbs.value = (day && day.carbs) || 0
    fat.value = (day && day.fat) || 0
    exercise.value = (day && day.exercise) || 0
    updateCaloriesUI()
  }

  checkBtn.addEventListener('click', ()=>{
    const key = todayKey()
    const checked = !(getDay(key) && getDay(key).checked)
    saveDay(key, { checked, log: logInput.value, protein: Number(protein.value||0), carbs: Number(carbs.value||0), fat: Number(fat.value||0), exercise: Number(exercise.value||0) })
    refreshUI()
  })

  // Auto-save fields when changed
  ;[logInput,protein,carbs,fat,exercise].forEach(el=>{
    el.addEventListener('change', ()=>{
      const key = todayKey()
      saveDay(key, { log: logInput.value, protein: Number(protein.value||0), carbs: Number(carbs.value||0), fat: Number(fat.value||0), exercise: Number(exercise.value||0) })
      updateCaloriesUI()
      refreshUI()
    })
  })

  // Initialize
  document.addEventListener('DOMContentLoaded', ()=>{
    refreshUI()
    updateCaloriesUI()
  })

})();
