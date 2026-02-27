export default function RedirectLoader() {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 border-3 border-border rounded-full animate-spin" style={{
            borderTopColor: 'rgb(0, 0, 0)',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent'
          }}></div>
        </div>
        <p className="text-lg font-medium text-foreground">
          Opening full product details...
        </p>
      </div>
    </div>
  )
}
