/**
 * Button 组件 - 移动端优化的按钮组件
 * 提供多种样式变体，专门针对触摸交互进行优化
 */

import React from 'react'

/**
 * 现代化按钮组件
 * 支持多种样式变体和渐变效果
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  // 变体样式
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary text-white'
      case 'secondary':
        return 'bg-gradient-secondary text-white hover:shadow-lg'
      case 'ghost':
        return 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
      case 'outline':
        return 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400'
      case 'glass':
        return 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  }

  // 尺寸样式
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-6 py-3 text-base'
    }
  }

  const buttonClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    font-semibold rounded-2xl
    transition-all duration-300 ease-out
    transform active:scale-95
    focus:outline-none focus:ring-4 focus:ring-blue-500/30
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : 'cursor-pointer'}
    ${className}
  `.trim()

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="inline-flex items-center mr-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        </div>
      )}
      {children}
    </button>
  )
}

export default Button 