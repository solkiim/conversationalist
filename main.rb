require 'rubygems'
require 'sinatra'
#require 'sequel'

get '/' do
	redirect to('/index.html')
end