/**
 * Input 组件 - 移动端优化的输入框组件
 * 专门针对数字输入和不同移动端键盘类型进行优化
 */

import React from 'react'

/**
 * 现代化输入框组件
 * 支持多种样式和交互效果
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  suffix,
  prefix,
  className = '',
  ...props
}) => {
  const inputClasses = `
    input-modern
    w-full
    ${error ? 'border-red-400 focus:border-red-500' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim()

  return (
    <div className="space-y-2">
      {/* 标签 */}
      {label && (
        <label className="label-modern">
          {label}
        </label>
      )}
      
      {/* 输入框容器 */}
      <div className="relative">
        {/* 前缀 */}
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {prefix}
          </div>
        )}
        
        {/* 输入框 */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            ${inputClasses}
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
          `}
          style={{ fontSize: '16px' }} // 防止iOS自动缩放
          {...props}
        />
        
        {/* 后缀 */}
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
      </div>
      
      {/* 错误信息 */}
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input 