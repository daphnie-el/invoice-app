import EmptyStateImage from 'assets/empty_state.svg'
interface Props {
  title?: string
  imageSrc?: string
  info?: string
  children?: React.ReactNode
}
const EmptyState = ({ title, imageSrc, info, children }: Props) => {
  return (
    <section
      className="p-5 w-100 d-flex flex-column align-items-center w-100 "
      aria-label={'Empty State'}
      aria-live="polite"
    >
      <img
        className=""
        src={imageSrc || EmptyStateImage}
        alt="Empty state illustration"
      />
      <h3 className="pt-4 h3 fw-semibold text-center">
        {title || 'No Data Available'}
      </h3>
      <p className="pb-2 w-100 text-center text-slate-500">
        {info ||
          'There is currently no data to display. Please check back later or add some data to get started.'}
      </p>
      {children}
    </section>
  )
}

export default EmptyState
