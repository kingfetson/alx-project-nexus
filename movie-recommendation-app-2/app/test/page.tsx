export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#22c55e', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Hello World
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          Basic test page
        </p>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block',
            backgroundColor: 'black',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Back to home
        </a>
      </div>
    </div>
  )
}
