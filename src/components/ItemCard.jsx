import React from 'react'
import './ItemCard.css'

function ItemCard({ item }) {
  return (
    <div className="item-card">
      {item.image_url && (
        <div className="item-image-container">
          <img 
            src={item.image_url} 
            alt={item.item_name}
            className="item-image"
          />
        </div>
      )}
      <div className="item-info">
        <h3>{item.item_name}</h3>
        <p className="item-location">📍 {item.location}</p>
        <p className="item-date">📅 {new Date(item.date).toLocaleDateString()}</p>
        <p className="item-description">{item.description}</p>
        <p className="item-contact">📞 {item.contact}</p>
      </div>
    </div>
  )
}

export default ItemCard