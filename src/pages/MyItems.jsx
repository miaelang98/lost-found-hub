import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ItemForm from '../components/ItemForm'
import ItemCard from '../components/ItemCard'
import './Pages.css'

function MyItems() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    }
  }

  const handleSuccess = () => {
    setShowForm(false)
    fetchItems()
  }

  return (
    <div className="page">
      <h2 className="page-title">분실물 등록하기</h2>
      
      <button 
        className="add-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '취소' : '+ 분실물 등록하기'}
      </button>

      {showForm && (
        <ItemForm type="lost" onSuccess={handleSuccess} />
      )}

      <div className="items-section">
        <h3>최근 등록된 모든 항목</h3>
        {items.length === 0 ? (
          <p className="no-items">등록된 항목이 없습니다.</p>
        ) : (
          <div className="items-grid">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyItems