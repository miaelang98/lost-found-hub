import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ItemForm from '../components/ItemForm'
import ItemCard from '../components/ItemCard'
import SearchBar from '../components/SearchBar'
import './Pages.css'

function LostItems() {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(true) // 기본으로 폼 보이기

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'lost')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('데이터 로드 오류:', error)
    }
  }

  const handleSuccess = () => {
    fetchItems()
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page">
      <h2 className="page-title">잃어버렸어요 😢</h2>
      <p className="page-description">분실한 물건을 등록해주세요</p>
      
      {/* 등록 폼 */}
      <div className="form-section">
        <ItemForm type="lost" onSuccess={handleSuccess} />
      </div>

      {/* 구분선 */}
      <div className="divider">
        <span>등록된 분실물</span>
      </div>

      {/* 검색 바 */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* 목록 */}
      <div className="items-section">
        {filteredItems.length === 0 ? (
          <p className="no-items">
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 분실물이 없습니다.'}
          </p>
        ) : (
          <div className="items-grid">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LostItems