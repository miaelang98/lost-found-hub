import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ItemForm from '../components/ItemForm'
import ItemCard from '../components/ItemCard'
import './Pages.css'

function FoundItems() {
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
        .eq('type', 'found')
        .order('created_at', { ascending: false })

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
      <h2 className="page-title">습득물 등록</h2>
      
      <button 
        className="add-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '취소' : '+ 습득물 등록하기'}
      </button>

      {showForm && (
        <ItemForm type="found" onSuccess={handleSuccess} />
      )}

      <div className="items-section">
        <h3>최근 등록된 습득물</h3>
        {items.length === 0 ? (
          <p className="no-items">등록된 습득물이 없습니다.</p>
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

export default FoundItems