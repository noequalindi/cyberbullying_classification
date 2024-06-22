import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
import requests

app = dash.Dash(__name__)

app.layout = html.Div(
    style={
        'background-image': 'url("/assets/bg.jpg")',
        'background-size': 'cover',
        'display': 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        'height': '100vh',
        'text-align': 'center'
    },
    children=[
        html.Div(
            style={
                'background-color': '#2F2F2F',
                'padding': '20px',
                'border-radius': '10px',
                'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
                'width': '50%',
                'margin-bottom': '20px' 
            },
            children=[
                html.H1('Cyberbullying Classification', style={'color': 'white', 'text-align': 'center'}),
                html.Label('Escribe tu tweet', style={'font-weight': 'bold', 'color':'white'}),
                dcc.Textarea(
                    id='clean_tweet',
                    value='Escribe tu tweet aquí...',
                    style={
                        'width': '100%',
                        'height': 100,
                        'margin-top': '10px',
                        'color': 'black',  
                        'font-size': '16px',  
                        'border': '1px solid #ccc',
                        'border-radius': '5px',
                        'padding': '10px',
                        'box-sizing': 'border-box' 
                    },
                ),
                html.Button(
                    'Analizar el tweet', 
                    id='button', 
                    n_clicks=0, 
                    style={
                        'margin-top': '20px', 
                        'font-size': '18px', 
                        'padding': '10px 20px',  
                        'border-radius': '10px',  
                        'background-color': '#008080',  
                        'color': 'white',
                        'border': 'none',
                        'cursor': 'pointer',
                        'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
                        'font-weight': 'bold'
                    }
                ),
            ]
        ),
        html.Div(
            id='output',
            style={
                'background-color': '#2F2F2F',
                'padding': '20px',
                'border-radius': '10px',
                'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
                'width': '50%',
                'color': 'white'
            },
            children=[
                html.H3('Resultado del Análisis:', style={'margin-bottom': '10px', 'color': '#D3D3D3'}),
                html.Div(id='result_text', style={'font-size': '16px', 'color': '#FFA500'})
            ]
        )
    ]
)

@app.callback(
    Output('output', 'children'),
    Input('button', 'n_clicks'),
    State('clean_tweet', 'value')
)
def update_output(n_clicks, clean_tweet):
    if n_clicks > 0:
        try:
            response = requests.post('http://fastapi:8001/predict', json={
                'clean_tweet': clean_tweet
            })
            response.raise_for_status()
            prediction = response.json().get('prediction', 'Error en la respuesta de la API')

            prediction_mapping = {
                0: "No cyberbullying",
                1: "Gender-based cyberbullying",
                2: "Religion-based cyberbullying",
                3: "Age-based cyberbullying",
                4: "Ethnicity-based cyberbullying"
            }
            
            prediction_text = prediction_mapping.get(prediction, "Unknown category")
            return [
                html.Div(f'El texto ingresado es de tipo:', style={'font-size': '16px'}),
                html.Div(prediction_text, style={'font-size': '24px', 'font-weight': 'bold', 'margin-top': '10px', 'color':'#FF7F50'})
            ]
        except requests.exceptions.RequestException as e:
            return f'Error al conectar con la API: {e}'
    return ''

if __name__ == '__main__':
    app.run_server(debug=True, host='0.0.0.0', port=8050)
