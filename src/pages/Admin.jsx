import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import './Admin.css'

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'admin1234' // 원하는 비밀번호로 변경하세요!

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      fetchPendingItems()
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  const fetchPendingItems = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
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
      fetchPendingItems()
    } catch (error) {
      alert('승인 실패: ' + error.message)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('삭제되었습니다.')
      fetchPendingItems()
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

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>승인 대기 중인 항목</h2>
        <button onClick={() => setIsLoggedIn(false)}>로그아웃</button>
      </div>

      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : items.length === 0 ? (
        <p className="no-items">승인 대기 중인 항목이 없습니다.</p>
      ) : (
        <div className="admin-items">
          {items.map(item => (
            <div key={item.id} className="admin-item">
              {item.image_url && (
                <img src={item.image_url} alt={item.item_name} />
              )}
              <div className="admin-item-info">
                <h3>{item.item_name}</h3>
                <p><strong>구분:</strong> {item.type === 'found' ? '습득물' : '분실물'}</p>
                <p><strong>장소:</strong> {item.location}</p>
                <p><strong>날짜:</strong> {new Date(item.date).toLocaleDateString()}</p>
                <p><strong>설명:</strong> {item.description}</p>
                <p><strong>연락처:</strong> {item.contact}</p>
              </div>
              <div className="admin-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(item.id)}
                >
                  ✓ 승인
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(item.id)}
                >
                  ✕ 거부
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