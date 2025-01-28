// // src/utils/faker.ts
// import { faker } from '@faker-js/faker';
// import { Column } from '@prisma/client';

// export const generateFakeData = (columns: Column[], rows: number): Array<Record<string, string | number>> => {
//   const data: Array<Record<string, string | number>> = [];
  
//   for (let i = 0; i < rows; i++) {
//     const row: Record<string, string | number> = {};
    
//     columns.forEach((column) => {
//       if (column.type === 'TEXT') {
//         row[column.id] = faker.lorem.words(3);
//       } else if (column.type === 'NUMBER') {
//         row[column.id] = faker.datatype.number({ min: 1, max: 100 });
//       }
//       // You can handle more column types here if needed
//     });
    
//     data.push(row);
//   }
  
//   return data;
// };
