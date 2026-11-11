#!/usr/bin/env python3
"""Tạo tệp CSV MINH HỌA (không phải dữ liệu thật) để kiểm tra công cụ phân tích.

Cách dùng: python3 scripts/survey/tao_du_lieu_minh_hoa.py <phieu A|B|C> <số_dòng> <đường_dẫn_csv>
Tên tệp và dòng đầu tiên trong cột "Dấu thời gian" đều ghi rõ là minh họa.
"""
import csv
import random
import sys
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from phan_tich_khao_sat import SPEC, CONSENT_Q, CONSENT_YES

def main():
    phieu, so, duong = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    rnd = random.Random(20260101)
    headers = ['Dấu thời gian (MINH HỌA)', CONSENT_Q[phieu]] + [t for _, t, _ in SPEC[phieu]]
    with open(duong, 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        w.writerow(headers)
        for i in range(so):
            row = ['MINH HỌA ' + str(i + 1), CONSENT_YES[phieu]]
            for kieu, _, lua in SPEC[phieu]:
                if kieu == 'thang':
                    row.append(str(rnd.choices([1, 2, 3, 4, 5], weights=[1, 2, 3, 3, 2])[0]))
                elif kieu == 'tn':
                    row.append(rnd.choice(lua))
                else:
                    k = rnd.randint(1, min(3, len(lua)))
                    row.append(', '.join(rnd.sample(lua, k)))
            w.writerow(row)
    print('Đã tạo', so, 'dòng minh họa tại', duong)

if __name__ == '__main__':
    main()
