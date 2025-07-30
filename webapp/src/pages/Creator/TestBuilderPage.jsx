import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCreator } from '../../context/CreatorContext';
import Button from '../../components/Button/Button';

export default function TestBuilderPage() {
  const { testId } = useParams();      // 'new' | id
  const nav = useNavigate();
  const { tests, addTest, editTest } = useCreator();

  const existing = tests.find(t=>t.id===+testId);
  const [title,setTitle]=useState(existing?.title||'');
  const [questions,setQ]=useState(existing?.questions||[]);

  const addQuestion = () =>
    setQ([...questions,{id:Date.now(), text:'', type:'one', answers:[]}]);

  const saveTest = () => {
    const data={ id: existing?.id, title, questions };
    existing ? editTest(data) : addTest(data);
    nav('/creator/tests');
  };

  return (
    <div style={{maxWidth:800}}>
      <h3>{existing?'Редактировать тест':'Новый тест'}</h3>
      <input placeholder="Название теста" value={title} onChange={(e)=>setTitle(e.target.value)}/>

      {questions.map((q,i)=>(
        <div key={q.id} style={{border:'1px solid var(--border)',padding:12,marginTop:12}}>
          <input
            placeholder={`Вопрос ${i+1}`}
            value={q.text}
            onChange={(e)=>{
              const copy=[...questions];
              copy[i].text=e.target.value;
              setQ(copy);
            }}
            style={{width:'100%'}}
          />

          <label style={{fontSize:'.8rem'}}>
            <input type="radio" checked={q.type==='one'} onChange={()=>{const c=[...questions];c[i].type='one';setQ(c);}}/>
            один из вариантов
          </label>
          <label style={{fontSize:'.8rem',marginLeft:12}}>
            <input type="radio" checked={q.type==='many'} onChange={()=>{const c=[...questions];c[i].type='many';setQ(c);}}/>
            несколько вариантов
          </label>

          {/* Answers */}
          {q.answers.map((a,ai)=>(
            <div key={ai} style={{display:'flex',gap:6,marginTop:6}}>
              <input
                value={a.text}
                onChange={e=>{
                  const c=[...questions];
                  c[i].answers[ai].text=e.target.value;
                  setQ(c);
                }}
                style={{flex:1}}
              />
              <label>
                <input
                  type={q.type==='one'?'radio':'checkbox'}
                  name={`q${q.id}`}
                  checked={a.correct}
                  onChange={()=>{
                    const c=[...questions];
                    if(q.type==='one'){
                      c[i].answers.forEach(ans=>ans.correct=false);
                    }
                    c[i].answers[ai].correct=!c[i].answers[ai].correct;
                    setQ(c);
                  }}
                />
                правильный
              </label>
              <Button variant="secondary" onClick={()=>{
                const c=[...questions];
                c[i].answers.splice(ai,1);
                setQ(c);
              }}>Удалить</Button>
            </div>
          ))}

          <Button variant="secondary" style={{marginTop:6}}
            onClick={()=>{
              const c=[...questions];
              c[i].answers.push({text:'',correct:false});
              setQ(c);
            }}
          >+ Ответ</Button>
        </div>
      ))}

      <Button onClick={addQuestion} style={{marginTop:16}}>+ Вопрос</Button>

      <div style={{display:'flex',gap:12,marginTop:24}}>
        <Button onClick={saveTest}>Сохранить</Button>
        <Button variant="secondary" onClick={()=>nav('/creator/tests')}>Отмена</Button>
      </div>
    </div>
  );
}
