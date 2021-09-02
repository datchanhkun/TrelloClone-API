//Hàm sắp xếp array dựa trên 1 array khác => sort array lồng array
export const mapOrder = (array, order, key) => {
  array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]))
  return array
}