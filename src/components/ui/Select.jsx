/**
 * Select 组件 - 移动端优化的选择器组件
 * 支持触摸友好的下拉选择和标签式选择
 */

import React, { useState } from 'react'

/**
 * 现代化选择框组件
 * 支持标签页样式和下拉样式
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = '请选择',
  variant = 'default',
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // 标签页样式的选择器
  if (variant === 'tabs') {
    return (
      <div className="space-y-2">
        {label && (
          <label className="label-modern">
            {label}
          </label>
        )}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-xl text-xs font-medium flex-1 min-w-0
                transition-all duration-300 ease-out
                border-2 transform active:scale-95 
                whitespace-nowrap overflow-hidden text-ellipsis
                ${value === option.value
                  ? 'bg-gradient-card text-white border-blue-500 shadow-lg'
                  : 'bg-white/80 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // 默认下拉样式
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="space-y-2">
      {label && (
        <label className="label-modern">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* 选择器按钮 */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            input-modern
            w-full flex items-center justify-between
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          {/* 下拉箭头 */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 下拉选项 */}
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* 选项列表 */}
            <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm
                    transition-all duration-200
                    hover:bg-blue-50 hover:text-blue-700
                    ${value === option.value 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Select 