import ImageSlider from './ImageSlider'
    
export const IMAGES = ['2.jpg', '4.jpg', '9.jpg', '3.jpg', '1.jpg'] 

export default function ImageBox() {
  return (
    <div className='w-full max-w-md md:max-w-lg lg:max-w-xl rounded-xl shadow-xl overflow-hidden dark:brightness-80'>
      <ImageSlider imageUrls={IMAGES} />
    </div>
  )
}