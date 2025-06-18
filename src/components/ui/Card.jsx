/**
 * Card 组件 - 卡片容器组件
 * 为商品比价条目提供美观的卡片容器，支持移动端触摸交互
 */

import React from 'react'

/**
 * 现代化卡片组件
 * 支持毛玻璃效果和多种变体
 */
const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'modern':
        return 'card-modern'
      case 'stat':
        return 'stat-card'
      case 'analysis':
        return 'analysis-card'
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20'
      default:
        return 'bg-white rounded-2xl shadow-sm border border-gray-100'
    }
  }

  const cardClasses = `
    ${getVariantClasses()}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim()

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * 卡片头部组件
 * 用于构建更复杂的卡片头部布局
 */
const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
)

/**
 * 卡片内容组件
 * 提供标准的内容容器
 */
const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

/**
 * 卡片操作区组件
 * 用于放置操作按钮等
 */
const CardActions = ({ children, className = '', align = 'right', ...rest }) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  }

  return (
    <div 
      className={`flex items-center gap-3 mt-6 ${alignStyles[align]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

// 子组件
Card.Header = CardHeader
Card.Content = CardContent
Card.Actions = CardActions
Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
)

// 默认导出主组件
export default Card
 