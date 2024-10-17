import React from 'react'
import TypewriterEffect from '../components/TypewriterEffect'

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>
        <TypewriterEffect text="你好,我是云牧" speed={150} />
      </h1>
      {/* 其他内容 */}
    </div>
  )
}

export default HomePage
