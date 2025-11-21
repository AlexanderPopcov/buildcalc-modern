import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      title: 'Калькулятор бетона',
      description: 'Рассчитайте объем и вес бетона для фундамента, стяжки и других работ',
      icon: '🏗️',
      link: '/concrete'
    },
    {
      title: 'Калькулятор плитки',
      description: 'Рассчитайте необходимое количество плитки для пола и стен',
      icon: '🟥',
      link: '/tile'
    },
    {
      title: 'Конвертер единиц',
      description: 'Мгновенно конвертируйте длину, объем и вес',
      icon: '🔄',
      link: '/converter'
    },
    {
      title: 'Избранное',
      description: 'Сохраняйте важные расчеты для быстрого доступа',
      icon: '⭐',
      link: '/favorites'
    }
  ]

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Профессиональные строительные расчеты
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Точные калькуляторы для строителей. Все данные сохраняются локально в вашем браузере.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <Link 
            key={index} 
            to={feature.link}
            className="card p-6 hover:-translate-y-1 transition-all duration-300 transform"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
              <div className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Начать расчет →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-0">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Все данные хранятся в вашем браузере</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Никаких серверов, никакой отправки данных - ваши расчеты остаются конфиденциальными и доступны даже без интернета.
          </p>
          <Link 
            to="/concrete" 
            className="btn btn-primary px-8 py-3 text-lg hover:shadow-lg transition-shadow"
          >
            Начать строить
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home