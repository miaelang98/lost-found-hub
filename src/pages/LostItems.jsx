import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import SearchBar from '../components/SearchBar'
import ItemCard from '../components/ItemCard'
import './Pages.css'

function LostItems() {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="page">
      <h2 className="page-title">분실물 찾기</h2>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {filteredItems.length === 0 ? (
        <p className="no-items">등록된 분실물이 없습니다.</p>
      ) : (
        <div className="items-grid">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LostItems