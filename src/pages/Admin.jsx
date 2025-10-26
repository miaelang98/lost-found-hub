import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import './Admin.css'

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [pendingItems, setPendingItems] = useState([])
  const [approvedItems, setApprovedItems] = useState([])
  const [activeView, setActiveView] = useState('pending') // 'pending' or 'approved'
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'admin1234' // 원하는 비밀번호로 변경하세요!

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      fetchAllItems()
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  const fetchAllItems = async () => {
    setLoading(true)
    try {
      // 승인 대기 항목
      const { data: pending, error: pendingError } = await supabase
        .from('items')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false })

      if (pendingError) throw pendingError
      setPendingItems(pending || [])

      // 승인된 항목
      const { data: approved, error: approvedError } = await supabase
        .from('items')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (approvedError) throw approvedError
      setApprovedItems(approved || [])

    } catch (error) {
      console.error('데이터 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ approved: true })
        .eq('id', id)

      if (error) throw error
      
      alert('승인되었습니다!')
      fetchAllItems()
    } catch (error) {
      alert('승인 실패: ' + error.message)
    }
  }

  const handleDelete = async (id, itemName) => {
    if (!window.confirm(`"${itemName}"을(를) 정말 삭제하시겠습니까?`)) return

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('삭제되었습니다.')
      fetchAllItems()
    } catch (error) {
      alert('삭제 실패: ' + error.message)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h2>🔒 관리자 로그인</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">로그인</button>
          </form>
        </div>
      </div>
    )
  }

  const currentItems = activeView === 'pending' ? pendingItems : approvedItems

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>관리자 페이지</h2>
        <button onClick={() => setIsLoggedIn(false)} className="logout-btn">로그아웃</button>
      </div>

      {/* 탭 전환 */}
      <div className="admin-tabs">
        <button 
          className={activeView === 'pending' ? 'active' : ''}
          onClick={() => setActiveView('pending')}
        >
          승인 대기 ({pendingItems.length})
        </button>
        <button 
          className={activeView === 'approved' ? 'active' : ''}
          onClick={() => setActiveView('approved')}
        >
          승인 완료 ({approvedItems.length})
        </button>
      </div>

      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : currentItems.length === 0 ? (
        <p className="no-items">
          {activeView === 'pending' ? '승인 대기 중인 항목이 없습니다.' : '승인된 항목이 없습니다.'}
        </p>
      ) : (
        <div className="admin-items">
          {currentItems.map(item => (
            <div key={item.id} className="admin-item">
              {item.image_url && (
                <div className="admin-image-container">
                  <img src={item.image_url} alt={item.item_name} />
                </div>
              )}
              <div className="admin-item-info">
                <h3>{item.item_name}</h3>
                <p><strong>구분:</strong> {item.type === 'found' ? '습득물' : '분실물'}</p>
                <p><strong>장소:</strong> {item.location}</p>
                <p><strong>날짜:</strong> {new Date(item.date).toLocaleDateString()}</p>
                {item.description && <p><strong>설명:</strong> {item.description}</p>}
                <p><strong>연락처:</strong> {item.contact}</p>
              </div>
              <div className="admin-actions">
                {activeView === 'pending' && (
                  <button 
                    className="approve-btn"
                    onClick={() => handleApprove(item.id)}
                  >
                    ✓ 승인
                  </button>
                )}
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(item.id, item.item_name)}
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin