/**
 * 实惠助手 - 商品价格比较神器
 * 帮助用户快速比较不同商品的单位价格，找到最实惠的选择
 */

import React, { useState, useEffect, useCallback } from 'react'
import Card from './components/ui/Card'
import Button from './components/ui/Button'
import Input from './components/ui/Input'
import Select from './components/ui/Select'
import ShareImage from './components/ShareImage'

// 商品类别和单位配置 - 定义在组件外部，避免重新创建
const categories = [
  { label: '🥩 肉蛋蔬果', value: 'food', units: ['kg', 'g', '斤', '个'] },
  { label: '🥛 牛奶饮料', value: 'drinks', units: ['ml', 'L', '瓶'] },
  { label: '🧴 美妆沐浴', value: 'beauty', units: ['ml', 'L', 'g'] },
  { label: '🏠 日用品', value: 'household', units: ['个', '包', 'ml', 'g'] },
]

// 商品项组件 - 定义在外部，避免重新创建
const ProductItem = React.memo(({ product, index, updateProduct, selectedUnit, unitPrice }) => (
  <div className="card-modern p-6 space-y-3">
    <div className="flex items-center justify-between">
      <span className="label-modern">商品 {index + 1}</span>
      <div className={`rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : 'rank-3'}`}>
        {index + 1}
      </div>
    </div>
    
    {/* 商品名称输入 */}
    <div>
      <Input
        placeholder={`商品${index + 1}`}
        value={product.name}
        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
        className="input-modern w-full"
      />
    </div>

    {/* 价格和数量输入 */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label-modern">价格 (元)</label>
        <Input
          type="number"
          placeholder="0.00"
          value={product.price}
          onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
          className="input-modern"
        />
      </div>
      <div>
        <label className="label-modern">数量 ({selectedUnit})</label>
        <Input
          type="number"
          placeholder="0"
          value={product.quantity}
          onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
          className="input-modern"
        />
      </div>
    </div>

    {/* 单价显示 */}
    <div className="price-display">
      <div className="price-label">单价</div>
      <div className="price-value">
        ¥{unitPrice?.formattedUnitPrice || '--'}
      </div>
      <div className="price-label">每{selectedUnit}</div>
    </div>
  </div>
))

/**
 * 实惠助手主应用组件
 * 现代化价格比较工具，采用优雅的蓝色主题设计
 */
function App() {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [products, setProducts] = useState([
    { id: 1, name: '商品1', price: '', quantity: '' },
    { id: 2, name: '商品2', price: '', quantity: '' },
    { id: 3, name: '商品3', price: '', quantity: '' }
  ])
  const [unitPrices, setUnitPrices] = useState([])
  const [rankings, setRankings] = useState([])
  const [showShareImage, setShowShareImage] = useState(false)

  // 计算单价
  const calculateUnitPrices = useCallback(() => {
    const prices = products.map(product => {
      if (product.price && product.quantity) {
        const price = parseFloat(product.price)
        const quantity = parseFloat(product.quantity)
        if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
          return {
            ...product,
            unitPrice: price / quantity,
            formattedUnitPrice: (price / quantity).toFixed(2)
          }
        }
      }
      return { ...product, unitPrice: null, formattedUnitPrice: '--' }
    })
    
    setUnitPrices(prices)

    // 计算排名
    const validPrices = prices.filter(p => p.unitPrice !== null)
    const sorted = [...validPrices].sort((a, b) => a.unitPrice - b.unitPrice)
    const newRankings = sorted.map((product, index) => ({
      ...product,
      rank: index + 1,
      savings: index === 0 ? 0 : ((product.unitPrice - sorted[0].unitPrice) / sorted[0].unitPrice * 100).toFixed(1)
    }))
    
    setRankings(newRankings)
  }, [products])

  // 监听数据变化自动计算
  useEffect(() => {
    calculateUnitPrices()
  }, [calculateUnitPrices])

  // 处理类别变化 - 使用useCallback优化
  const handleCategoryChange = useCallback((value) => {
    setSelectedCategory(value)
    const category = categories.find(cat => cat.value === value)
    if (category && category.units.length > 0) {
      setSelectedUnit(category.units[0])
    }
  }, [])

  // 更新商品信息 - 使用useCallback优化
  const updateProduct = useCallback((id, field, value) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ))
  }, [])

  // 获取智能建议 - 使用useCallback缓存
  const getSmartTip = useCallback(() => {
    if (rankings.length < 2) return null
    
    const cheapest = rankings[0]
    const savings = rankings[rankings.length - 1].savings
    
    const tips = {
      food: `${cheapest.name}性价比最高！肉蛋蔬果建议按需购买，新鲜食材趁活动时多买一些。`,
      drinks: `选择${cheapest.name}，每${selectedUnit}便宜${savings}%，饮品适合大容量购买更优惠！`,
      beauty: `${cheapest.name}最划算，美妆用品可以考虑囤货，保质期通常较长。`,
      household: `${cheapest.name}性价比最佳，日用品可以批量采购降低成本。`
    }
    
    return tips[selectedCategory] || `${cheapest.name}最实惠，价格比最贵的便宜${savings}%！`
  }, [rankings, selectedUnit, selectedCategory])



  const hasValidData = rankings.length >= 2

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="safe-top safe-bottom px-4 py-8">
        {/* 头部标题 */}
        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            💰 实惠助手
          </h1>
          <p className="text-white/80 text-sm">
            智能价格对比，帮你找到最划算的选择
          </p>
        </div>

        {/* 类别选择卡片 */}
        <div className="card-modern p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            🛍️ 商品类别
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label-modern">选择类别</label>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categories.map(cat => ({ value: cat.value, label: cat.label }))}
                placeholder="请选择商品类别"
                variant="tabs"
              />
            </div>
            
            {selectedCategory && (
              <div>
                <label className="label-modern">计量单位</label>
                <Select
                  value={selectedUnit}
                  onChange={setSelectedUnit}
                  options={categories.find(cat => cat.value === selectedCategory)?.units.map(unit => ({
                    value: unit,
                    label: unit
                  })) || []}
                  variant="tabs"
                />
              </div>
            )}
          </div>
        </div>

        {/* 商品输入区域 */}
        {selectedCategory && selectedUnit && (
          <div className="space-y-6 mb-8 animate-fade-in">
            {products.map((product, index) => (
              <ProductItem 
                key={product.id} 
                product={product} 
                index={index} 
                updateProduct={updateProduct}
                selectedUnit={selectedUnit}
                unitPrice={unitPrices[index]}
              />
            ))}
          </div>
        )}

        {/* 分析结果 */}
        {hasValidData && (
          <div className="analysis-card p-6 mb-8 animate-fade-in relative">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-xl font-bold text-white flex items-center">
                📊 价格分析
              </h2>
              <Button
                onClick={() => setShowShareImage(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-4 py-2"
              >
                📤 分享
              </Button>
            </div>

            <div className="space-y-4 relative z-10">
              {/* 排名显示 */}
              <div className="space-y-3">
                {rankings.map((product, index) => (
                  <div key={product.id} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : 'rank-3'}`}>
                          {product.rank}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {product.name || `商品${product.id}`}
                          </div>
                          <div className="text-white/80 text-sm">
                            ¥{product.formattedUnitPrice}/{selectedUnit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {index === 0 ? (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            最便宜
                          </span>
                        ) : (
                          <span className="text-white/90 text-sm">
                            贵 {product.savings}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 智能建议 */}
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <div className="font-semibold text-white mb-1">智能建议</div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {getSmartTip()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 分享图片组件 */}
        {showShareImage && hasValidData && (
          <ShareImage
            rankings={rankings}
            selectedUnit={selectedUnit}
            selectedCategory={categories.find(cat => cat.value === selectedCategory)?.label}
            onClose={() => setShowShareImage(false)}
          />
        )}

        {/* 使用说明 */}
        {!selectedCategory && (
          <div className="card-modern p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              📖 使用说明
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. 选择商品类别和计量单位</p>
              <p>2. 输入商品价格和对应数量</p>
              <p>3. 查看单价对比和购买建议</p>
              <p>4. 一键分享对比结果</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 