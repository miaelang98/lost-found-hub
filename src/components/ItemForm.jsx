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

  // 오늘 날짜를 YYYY-MM-DD 형식으로
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

      // 이미지가 있으면 압축 후 업로드
      if (imageFile) {
        const compressedImage = await compressImage(imageFile)
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(filePath, compressedImage)

        if (uploadError) throw uploadError

        // 이미지 URL 가져오기
        const { data } = supabase.storage
          .from('items')
          .getPublicUrl(filePath)
        
        imageUrl = data.publicUrl
      }

      // 데이터베이스에 저장
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
            approved: false  // 승인 대기 상태
          }
        ])

      if (error) throw error

      alert('등록이 완료되었습니다! 관리자 승인 후 게시됩니다.')
      
      // 폼 초기화
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
        <label>장소 *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="예: 3층 복도"
          required
        />
      </div>

      <div className="form-group">
        <label>날짜 *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={today}  // 오늘 이후 날짜 선택 불가
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
        <label>장소 *</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="예: 2층 2학년부"
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