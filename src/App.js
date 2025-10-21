import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import FoundItems from './pages/FoundItems'
import LostItems from './pages/LostItems'

function App() {
  const [activeTab, setActiveTab] = useState('found')

  return (
    <div className="App">
      <Header />
      
      {/* 탭 메뉴 */}
      <div className="tab-menu">
        <button 
          className={activeTab === 'found' ? 'active' : ''}
          onClick={() => setActiveTab('found')}
        >
          찾았어요 💡
        </button>
        <button 
          className={activeTab === 'lost' ? 'active' : ''}
          onClick={() => setActiveTab('lost')}
        >
          잃어버렸어요 😢
        </button>
      </div>

      {/* 탭별 내용 */}
      <div className="tab-content">
        {activeTab === 'found' && <FoundItems />}
        {activeTab === 'lost' && <LostItems />}
      </div>
    </div>
  )
}

export default App