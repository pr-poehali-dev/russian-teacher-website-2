import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Беспроводные наушники Premium',
    description: 'Качественный звук, активное шумоподавление, до 30 часов работы',
    price: 12990,
    image: 'https://cdn.poehali.dev/projects/00ac7611-91bd-4fc8-8258-46e6eb8bba52/files/78e2890c-a446-4e75-9e0c-5ad266e9a8f7.jpg'
  },
  {
    id: 2,
    name: 'Смарт-часы Sport Edition',
    description: 'Мониторинг здоровья, водонепроницаемые, GPS-трекер',
    price: 8990,
    image: 'https://cdn.poehali.dev/projects/00ac7611-91bd-4fc8-8258-46e6eb8bba52/files/fd82ace7-dd09-4cfc-aea3-a6f6aac55684.jpg'
  },
  {
    id: 3,
    name: 'Смартфон ProMax 128GB',
    description: 'Флагманская камера, быстрая зарядка, AMOLED дисплей',
    price: 45990,
    image: 'https://cdn.poehali.dev/projects/00ac7611-91bd-4fc8-8258-46e6eb8bba52/files/d3a5de1b-352a-44ee-a78e-e7b1f28382eb.jpg'
  },
  {
    id: 4,
    name: 'Портативная колонка Bass+',
    description: 'Мощный звук, 360° звучание, защита от воды IPX7',
    price: 5490,
    image: 'https://cdn.poehali.dev/projects/00ac7611-91bd-4fc8-8258-46e6eb8bba52/files/78e2890c-a446-4e75-9e0c-5ad266e9a8f7.jpg'
  },
  {
    id: 5,
    name: 'Планшет Pro 11"',
    description: 'Для работы и развлечений, стилус в комплекте, 256GB',
    price: 34990,
    image: 'https://cdn.poehali.dev/projects/00ac7611-91bd-4fc8-8258-46e6eb8bba52/files/d3a5de1b-352a-44ee-a78e-e7b1f28382eb.jpg'
  },
  {
    id: 6,
    name: 'Фитнес-браслет Active',
    description: 'Отслеживание активности, пульсометр, уведомления',
    price: 2990,
    image: 'https://cdn.poehali.dev/projects/00ac7611-91bd-4fc8-8258-46e6eb8bba52/files/fd82ace7-dd09-4cfc-aea3-a6f6aac55684.jpg'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentSection, setCurrentSection] = useState<'home' | 'catalog' | 'checkout'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Товар добавлен в корзину');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success('Товар удалён из корзины');
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    toast.success('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время');
    setCart([]);
    setCurrentSection('home');
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Store" size={28} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">Симбат Сити</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentSection('home')}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Главная
              </button>
              <button
                onClick={() => setCurrentSection('catalog')}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Каталог
              </button>
              <button
                onClick={() => setCurrentSection('checkout')}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Контакты
              </button>
            </div>

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                <p className="text-primary font-bold mt-1">{item.price.toLocaleString()} ₽</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-7 w-7 ml-auto"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Итого:</span>
                          <span className="text-primary">{totalPrice.toLocaleString()} ₽</span>
                        </div>
                        <Button
                          className="w-full mt-4"
                          size="lg"
                          onClick={() => {
                            setIsCartOpen(false);
                            setCurrentSection('checkout');
                          }}
                        >
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {currentSection === 'home' && (
        <section className="py-20 px-4 animate-fade-in">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Добро пожаловать в Симбат Сити
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Современные гаджеты и электроника по лучшим ценам. Качество, надёжность и быстрая доставка.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="text-lg px-8" onClick={() => setCurrentSection('catalog')}>
                <Icon name="ShoppingBag" size={20} className="mr-2" />
                Перейти в каталог
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="Info" size={20} className="mr-2" />
                Узнать больше
              </Button>
            </div>
          </div>
        </section>
      )}

      {currentSection === 'catalog' && (
        <section className="py-12 px-4 animate-fade-in">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Каталог товаров</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in">
                  <CardHeader className="p-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                    <CardDescription className="text-base mb-4">
                      {product.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {product.price.toLocaleString()} ₽
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" size="lg" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {currentSection === 'checkout' && (
        <section className="py-12 px-4 animate-fade-in">
          <div className="container mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Оформление заказа</CardTitle>
                <CardDescription>Заполните форму для завершения покупки</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя и фамилия</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Input
                      id="address"
                      placeholder="г. Москва, ул. Примерная, д. 123, кв. 45"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <h3 className="font-semibold text-lg">Ваш заказ:</h3>
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Итого:</span>
                        <span className="text-primary">{totalPrice.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    <Icon name="Check" size={20} className="mr-2" />
                    Подтвердить заказ
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <footer className="bg-foreground/5 py-12 px-4 mt-20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Store" size={24} className="text-primary" />
            <span className="text-xl font-bold">Симбат Сити</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Лучшие гаджеты и электроника для вас
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              О нас
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Доставка
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Гарантия
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Контакты
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-8">
            © 2024 Симбат Сити. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}