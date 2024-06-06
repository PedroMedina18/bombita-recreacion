function Recreador({error}) {
    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center overflow-hidden ">
            <img src={errorServidor} alt="Erorr System"  className='img-error'/>
            <p className="h1 mt-2 fw-bold text-center">{error}</p>
        </div>
    )
}

export default Recreador