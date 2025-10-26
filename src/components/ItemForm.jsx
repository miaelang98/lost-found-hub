import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { compressImage } from '../utils/imageCompression'
import './ItemForm.css'

function ItemForm({ type, onSuccess }) {
  const [formData, setFormData] = useState({
    itemName: '',
    location: '',
    date: '',
    description: '',
    contact: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = null

      if (imageFile) {
        const compressedImage = await compressImage(imageFile)
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(filePath, compressedImage)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('items')
          .getPublicUrl(filePath)
        
        imageUrl = data.publicUrl
      }

      const { error } = await supabase
        .from('items')
        .insert([
          {
            item_name: formData.itemName,
            type: type,
            location: formData.location,
            date: formData.date,
            description: formData.description,
            contact: formData.contact,
            image_url: imageUrl,
            approved: false
          }
        ])

      if (error) throw error

      alert('등록이 완료되었습니다! 관리자 승인 후 게시됩니다.')
      
      setFormData({
        itemName: '',
        location: '',
        date: '',
        description: '',
        contact: ''
      })
      setImageFile(null)
      
      if (onSuccess) onSuccess()

    } catch (error) {
      alert('등록 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // type에 따른 문구 설정
  const labels = {
    found: {
      location: '습득 장소',
      locationPlaceholder: '예: 3층 복도',
      date: '습득 날짜',
      contact: '보관 장소 또는 연락처',
      contactPlaceholder: '예: 행정실 또는 010-1234-5678'
    },
    lost: {
      location: '분실 장소',
      locationPlaceholder: '예: 운동장',
      date: '분실 날짜',
      contact: '찾아갈 장소 또는 연락처',
      contactPlaceholder: '예: 3학년 2반 또는 010-1234-5678'
    }
  }

  const label = labels[type]

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>물품명 *</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="예: 검정 우산"
          required
        />
      </div>

      <div className="form-group">
        <label>{label.location} *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={label.locationPlaceholder}
          required
        />
      </div>

      <div className="form-group">
        <label>{label.date} *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={today}
          required
        />
      </div>

      <div className="form-group">
        <label>설명</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="물품에 대한 상세 설명"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>{label.contact} *</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder={label.contactPlaceholder}
          required
        />
      </div>

      <div className="form-group">
        <label>사진</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageFile && (
          <p className="file-name">선택된 파일: {imageFile.name}</p>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? '등록 중...' : '등록하기'}
      </button>
    </form>
  )
}

export default ItemForm