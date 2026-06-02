function sortObjects(quantidade, arrayObj) {
  if (quantidade > arrayObj.length) {
    throw new Error('Quantidade não pode ser maior do que o tamanho do array')
  }

  const uniqueIds = new Set(arrayObj.map((obj) => obj.id))
  if (uniqueIds.size <= 1 && quantidade > 1) {
    throw new Error('O array só possui 1 item único')
  }

  while (true) {
    const selecionados = []

    for (let i = 0; i < quantidade; i++) {
      const randomIndex = Math.floor(Math.random() * arrayObj.length)
      selecionados.push(arrayObj[randomIndex])
    }

    if (quantidade <= 1) return selecionados

    const firstId = selecionados[0].id
    const allTheSame = selecionados.every((obj) => obj.id === firstId)

    if (!allTheSame) {
      return selecionados
    }
  }
}

export default sortObjects