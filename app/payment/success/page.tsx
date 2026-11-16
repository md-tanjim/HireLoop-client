
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'


const SuccessPage = async({ searchParams }:{searchParams: Promise<{session_id: string}>}) => {

  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_email,
    metadata,
    payment_intent,
    payment_status,

  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })



  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete' && payment_status==='paid') {

    console.log({status,customer_email,metadata,payment_intent,payment_status,})
    
    console.log(session_id)
    // const result = await paymentVarify(session_id);
    
    // console.log(result)
    
    
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customer_email}. If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }
}

export default SuccessPage;