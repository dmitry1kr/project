import math

def moving_average(series, window_size):
    moving_averages = []
    for i in range(len(series) - window_size + 1):
        window = series[i:i+window_size]
        moving_averages.append(math.ceil(sum(window) / window_size))
    return moving_averages
def prognoz(data, step, prognoz):
    m = None
    for i in range(prognoz):
        m = moving_average(data, step)
        y = math.ceil(m[-1] + (1/step) * (data[-1] - data[-2]))
        data.append(y)

    return data, m

data = [63, 95, 115, 164, 183, 221, 258]
#data = [63000, 95000, 115000, 164000, 183000, 221000, 258000]
date_prognoz = data.copy()

step = 3
t = 5
test = prognoz(date_prognoz, step, t)


e = sum((abs((data[i] - test[1][i-1]) / data[i])*100) for i in range(1, len(data) - 1))
MAE = sum(data[i]-test[1][i-1] for i in range(1, len(data) - 1)) / t
MSE = math.sqrt(sum((data[i]-test[1][i-1])**2 for i in range(1, len(data) - 1)) / t)
e_minus = e/t
print(f'{test[1]} - средние скользящие\n', f'{test[0]} - прогнозные значения')
print(f'{MAE} - средняя абсолютная ошибка\n', f'{MSE} - средняя квадратическая ошибка\n', f'{e_minus} - средняя относительная ошибка')

