import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { TextInput, StyleSheet, View, Alert, Text } from 'react-native';
import PlatformCard from './PlatformCard';
import { Game, GamePlatform } from './types';
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';


const placeholder = {
    label: 'Selecione o game',
    value: null
}

const BASE_URL = 'http://192.168.0.75:8080';

const mapSelectValues = (games: Game[]) => {
    return games.map(game => ({
        ...game,
        label: game.title,
        value: game.id
    }));
}

const CreateRecord = () => {

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [platform, setPlatform] = useState<GamePlatform>();
    const [selectedGame, setSelectedGame] = useState('');
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);

    const handleChangePlatform = (selectedPlatform: GamePlatform) => {
        setPlatform(selectedPlatform);
        const gamesByPlatform = allGames.filter(
            game => game.platform === selectedPlatform
        )
        setFilteredGames(gamesByPlatform);
    }

    const handleSubmit = () => {
        const payload = { name, age, gameId: selectedGame };
        axios.post(`${BASE_URL}/records`, payload)
        .then(() => {
          Alert.alert('Dados salvos com sucesso!');
          setName('');
          setAge('');
          setSelectedGame('');
          setPlatform(undefined);
          setFilteredGames([]);
        })
        .catch(() => Alert.alert('Erro ao salvar informações!'))       
    }

    useEffect(() => {
        axios.get(`${BASE_URL}/games`)
            .then(response => {
                const selectValues = mapSelectValues(response.data);
                setAllGames(selectValues);
            })
            .catch(() => Alert.alert('Erro ao listar os jogos!'))
    }, []);

    return (
        <>
            <Header />
            <View style={styles.container}>
                <TextInput
                    value={name}
                    style={styles.inputText}
                    placeholder="Nome"
                    placeholderTextColor="#9E9E9E"
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    keyboardType="numeric"
                    value={age}
                    style={styles.inputText}
                    placeholder="Idade"
                    placeholderTextColor="#9E9E9E"
                    onChangeText={text => setAge(text)}
                    maxLength={3}
                />
                <View style={styles.platformContainer}>
                    <PlatformCard
                        platform="PC"
                        icon="laptop"
                        onChange={handleChangePlatform}
                        activePlatform={platform}
                    />
                    <PlatformCard
                        platform="XBOX"
                        icon="xbox"
                        onChange={handleChangePlatform}
                        activePlatform={platform}
                    />
                    <PlatformCard
                        platform="PLAYSTATION"
                        icon="playstation"
                        onChange={handleChangePlatform}
                        activePlatform={platform}
                    />
                </View>
                {/*   1 - o pickerStyle nao pos o fundo branco 
                        tive que por o View com fundo branco
                      2 - nao precisou colocar aqui o value={selectedGame}. 
                        Com ele, da erro de change from inside other
                      3 - Isso me obrigou a colocar um setFilteredGames([])
                        no sendHandler */}
                <View style={styles.platformWhite}>
                    <RNPickerSelect
                        placeholder={placeholder}
                        onValueChange={value => {
                            setSelectedGame(value);
                        }}
                        items={filteredGames}
                        style={pickerSelecStyles}
                        Icon={() => {
                            return <Icon name="chevron-down" color="#9E9E9E" size={25} />
                        }}
                    />
                </View>
                <View style={styles.footer}>
                    <RectButton style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>
                            SALVAR
                        </Text>
                    </RectButton>
                </View>
            </View>
        </>
    );
}


const pickerSelecStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        color: '#ED7947',
        paddingRight: 30,
        fontFamily: "Play_700Bold",
        height: 50
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        color: '#ED7947',
        paddingRight: 30,
        fontFamily: "Play_700Bold",
        height: 50
    },
    placeholder: {
        color: '#9E9E9E',
        fontSize: 20,
        fontFamily: "Play_700Bold",
    },
    iconContainer: {
        top: 10,
        right: 12,
    }
});

const styles = StyleSheet.create({
    container: {
        marginTop: '15%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: 50
    },
    inputText: {
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 10,
        color: '#ED7947',
        fontFamily: "Play_700Bold",
        fontSize: 16,
        paddingLeft: 20,
        marginBottom: 21
    },
    platformContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        marginTop: '15%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#00D4FF',
        flexDirection: 'row',
        borderRadius: 10,
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: "Play_700Bold",
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0B1F34',
    },
    platformWhite: {
        backgroundColor: '#fff',
        borderRadius: 10,
    }
});

export default CreateRecord;