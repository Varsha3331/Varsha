import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import {BookOpen, Brain, CalendarDays, Check, ChevronLeft, ChevronRight, Dumbbell, Flag, Heart, Home, Plus, Shield, Sparkles, Target, Trash2, X} from 'lucide-react';
import './index.css';

const TASKS_KEY='varsha_tasks_v1'; const HISTORY_KEY='varsha_history_v1';
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const dateKey=d=>{const x=new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
const todayKey=dateKey(new Date());
const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const iconFor=t=>t.toLowerCase().includes('ai')?Brain:t.toLowerCase().includes('cyber')?Shield:t.toLowerCase().includes('health')?Dumbbell:t.toLowerCase().includes('read')?BookOpen:t.toLowerCase().includes('network')?Target:Flag;
const progressFor=tasks=>{if(!tasks.length)return 0; return Math.round(tasks.filter(t=>t.completed).length/tasks.length*100)};

function App(){
 const [tasks,setTasks]=useState(()=>load(TASKS_KEY,[]));
 const [history,setHistory]=useState(()=>load(HISTORY_KEY,{}));
 const [view,setView]=useState('today'); const [modal,setModal]=useState(false); const [month,setMonth]=useState(new Date()); const [selectedDay,setSelectedDay]=useState(null);
 const daily=progressFor(tasks);
 useEffect(()=>localStorage.setItem(TASKS_KEY,JSON.stringify(tasks)),[tasks]);
 useEffect(()=>{const h={...history,[todayKey]:{progress:daily,completed:tasks.filter(t=>t.completed).length,total:tasks.length,tasks:tasks.map(t=>({id:t.id,title:t.title,completed:t.completed}))}}; setHistory(prev=>({...prev,[todayKey]:h[todayKey]}));},[daily]);
 useEffect(()=>localStorage.setItem(HISTORY_KEY,JSON.stringify(history)),[history]);
 const toggleTask=id=>setTasks(ts=>ts.map(t=>t.id===id?{...t,completed:!t.completed}:t));
 const deleteTask=id=>setTasks(ts=>ts.filter(t=>t.id!==id));
 const addTask=title=>{setTasks(ts=>[...ts,{id:uid(),title,completed:false}]);setModal(false)};
 return <div className="app-shell">
   <div className="app-bg"/>
   <header className="topbar"><div className="brand"><div className="brand-mark">✦</div><div><b>Varsha's Daily Progress</b><span>Small steps + Big dreams</span></div><Heart size={18}/></div><div className="quote">“Discipline today,<br/>freedom tomorrow.”</div></header>
   {view==='today'?<Today tasks={tasks} daily={daily} toggleTask={toggleTask} deleteTask={deleteTask}/>:<Monthly history={history} month={month} setMonth={setMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>} 
   <nav className="bottom-nav"><button className={view==='today'?'active':''} onClick={()=>setView('today')}><Home size={20}/><span>Today</span></button><button className={view==='month'?'active':''} onClick={()=>setView('month')}><CalendarDays size={20}/><span>Monthly</span></button></nav>
   <button className="fab" onClick={()=>setModal(true)} aria-label="Add task"><Plus size={28}/></button>
   {modal&&<AddTaskModal onClose={()=>setModal(false)} onAdd={addTask}/>} 
 </div>
}

function Today({tasks,daily,toggleTask,deleteTask,onAdd}){return <main className="content">
 <section className="hero"><div><div className="eyebrow">GOOD TO SEE YOU</div><h1>Welcome back, <em>Varsha</em> <Sparkles size={25}/></h1><p>You're building a better version of yourself, one task at a time.</p></div><div className="mountain">☼</div></section>
 <section className="overview card"><div className="progress-ring" style={{'--p':daily}}><div><strong>{daily}%</strong><small>today</small></div></div><div className="overview-main"><span>Today's Progress</span><div className="big-progress"><i style={{width:`${daily}%`}}/></div><small>{tasks.filter(t=>t.completed).length} completed · {tasks.filter(t=>!t.completed).length} pending · {tasks.length} total</small></div><div className="overview-stat"><Check/><b>{tasks.filter(t=>t.completed).length}</b><span>Done</span></div></section>
 {tasks.length===0?<section className="empty card"><Target size={38}/><h2>Your day starts here</h2><p>Add your first task and build your own routine. Your monthly progress will update automatically.</p></section>:<section className="task-list">{tasks.map(t=><TaskCard key={t.id} task={t} toggleTask={toggleTask} deleteTask={deleteTask}/>)}</section>}
 </main>}

function TaskCard({task,toggleTask,deleteTask}){const Icon=iconFor(task.title);return <article className={`task card ${task.completed?'task-done':''}`}>
 <div className="task-main"><button className={`check ${task.completed?'checked':''}`} onClick={()=>toggleTask(task.id)}>{task.completed&&<Check size={18}/>}</button><div className="task-icon"><Icon size={22}/></div><div className="task-info"><h3>{task.title}</h3></div><div className="task-actions"><button className="done-btn" onClick={()=>toggleTask(task.id)}>{task.completed?<Check/>:'✓'} Done</button><button className="delete-btn" onClick={()=>deleteTask(task.id)}><Trash2/> Delete</button></div></div>
 </article>}

function AddTaskModal({onClose,onAdd}){const [title,setTitle]=useState('');const submit=e=>{e.preventDefault();if(!title.trim())return;onAdd(title.trim())};return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={submit}><button type="button" className="modal-x" onClick={onClose}><X/></button><div className="modal-head"><Sparkles/><div><h2>Create Task</h2><p>Make today's plan yours.</p></div></div><label>Task name<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Master Computer Networks"/></label><button className="create-btn" type="submit">Create Task</button></form></div>}

function Monthly({history,month,setMonth,selectedDay,setSelectedDay}){const year=month.getFullYear(),m=month.getMonth(),first=new Date(year,m,1),days=new Date(year,m+1,0).getDate(),start=first.getDay();const cells=Array.from({length:start+days},(_,i)=>i<start?null:i-start+1);const monthName=month.toLocaleString('en-IN',{month:'long',year:'numeric'});const prev=()=>setMonth(new Date(year,m-1,1));const next=()=>setMonth(new Date(year,m+1,1));const info=selectedDay?history[dateKey(new Date(year,m,selectedDay))]:null;return <main className="content"><section className="hero month-hero"><div><div className="eyebrow">YOUR JOURNEY</div><h1>Monthly <em>Progress</em> <CalendarDays size={25}/></h1><p>Every day you show up is part of your story.</p></div><div className="mountain">☼</div></section><section className="calendar-card card"><div className="calendar-head"><button onClick={prev}><ChevronLeft/></button><h2>{monthName}</h2><button onClick={next}><ChevronRight/></button></div><div className="weekdays">{['SUN','MON','TUE','WED','THU','FRI','SAT'].map(x=><span key={x}>{x}</span>)}</div><div className="calendar-grid">{cells.map((day,i)=>{if(!day)return <div key={i}/>;const k=dateKey(new Date(year,m,day)),h=history[k],p=h?.progress??0;return <button key={i} className={`day p${bucket(p)} ${k===todayKey?'today-day':''}`} onClick={()=>setSelectedDay(day)}><b>{day}</b><span>{p}%</span>{k===todayKey&&<i>Today</i>}</button>})}</div><div className="legend"><span><i className="l0"/>0%</span><span><i className="l1"/>1–25%</span><span><i className="l2"/>26–50%</span><span><i className="l3"/>51–75%</span><span><i className="l4"/>76–99%</span><span><i className="l5"/>100%</span></div></section>{info&&<section className="day-detail card"><div><div className="eyebrow">DAILY SNAPSHOT</div><h2>{new Date(year,m,selectedDay).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</h2></div><div className="detail-progress"><strong>{info.progress}%</strong><span>{info.completed} completed · {info.total-info.completed} pending</span></div><div className="history-tasks">{(info.tasks||[]).map(t=><div key={t.id}><span className={t.completed?'mini-check done':'mini-check'}>{t.completed?<Check size={13}/>:''}</span>{t.title}<b>{t.completed?'Done':'Pending'}</b></div>)}</div></section>}</main>}
function bucket(p){if(p===0)return 0;if(p<=25)return 1;if(p<=50)return 2;if(p<=75)return 3;if(p<100)return 4;return 5}
registerSW({ immediate: true });
createRoot(document.getElementById('root')).render(<App/>);
