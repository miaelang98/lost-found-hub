import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ItemForm from '../components/ItemForm'
import ItemCard from '../components/ItemCard'
import SearchBar from '../components/SearchBar'
import './Pages.css'

function FoundItems() {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false) // 기본으로 폼 숨기기

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

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page">
      {/* 상단 헤더 */}
      <div className="page-header">
        <div>
          <h2 className="page-title">찾았어요 💡</h2>
          <p className="page-subtitle">습득한 물건을 등록해주세요</p>
        </div>
        <button 
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ 닫기' : '+ 등록하기'}
        </button>
      </div>
      
      {/* 등록 폼 (토글) */}
      {showForm && (
        <div className="form-section">
          <ItemForm type="found" onSuccess={handleSuccess} />
        </div>
      )}

      {/* 검색 바 */}
      {!showForm && <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}

      {/* 목록 */}
      {!showForm && (
        <div className="items-section">
          <div className="items-count">{filteredItems.length}개의 습득물</div>
          {filteredItems.length === 0 ? (
            <p className="no-items">
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 습득물이 없습니다.'}
            </p>
          ) : (
            <div className="items-grid">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FoundItems