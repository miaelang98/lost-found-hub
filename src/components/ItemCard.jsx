// 데이터베이스에 저장 부분 수정
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
      approved: false  // 이 줄 추가!
    }
  ])

if (error) throw error

alert('등록이 완료되었습니다! 관리자 승인 후 게시됩니다.')