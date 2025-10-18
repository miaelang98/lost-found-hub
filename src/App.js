import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import LostItems from './pages/LostItems'
import FoundItems from './pages/FoundItems'
import MyItems from './pages/MyItems'

function App() {
  const [activeTab, setActiveTab] = useState('lost')

  return (
    <div className="App">
      <Header />
      
      {/* 탭 메뉴 */}
      <div className="tab-menu">
        <button 
          className={activeTab === 'lost' ? 'active' : ''}
          onClick={() => setActiveTab('lost')}
        >
          분실물 찾기
        </button>
        <button 
          className={activeTab === 'found' ? 'active' : ''}
          onClick={() => setActiveTab('found')}
        >
          습득물 등록
        </button>
        <button 
          className={activeTab === 'my' ? 'active' : ''}
          onClick={() => setActiveTab('my')}
        >
          내 등록물
        </button>
      </div>

      {/* 탭별 내용 */}
      <div className="tab-content">
        {activeTab === 'lost' && <LostItems />}
        {activeTab === 'found' && <FoundItems />}
        {activeTab === 'my' && <MyItems />}
      </div>
    </div>
  )
}

export default App